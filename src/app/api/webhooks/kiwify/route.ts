import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import crypto from "crypto"

// Kiwify Webhook Handler
// Documentation: https://help.kiwify.com.br/en/articles/5966675-webhooks

export async function POST(req: Request) {
    try {
        const payload = await req.json()

        // Basic Logging
        console.log("Kiwify Webhook received:", payload)

        const { order_status, product_id, Customer, Subscription, webhook_event_type } = payload

        // We only care about approved orders or renewals
        if (order_status !== "paid") {
            return NextResponse.json({ message: "Ignored: Not paid" }, { status: 200 })
        }

        // Identify the Plan
        const plan = await prisma.plan.findFirst({
            where: { kiwifyProductId: product_id }
        })

        if (!plan) {
            console.error(`Plan not found for Kiwify Product ID: ${product_id}`)
            return NextResponse.json({ message: "Plan not found" }, { status: 404 })
        }

        // Identify or Create User
        // Note: In a real scenario, you might want to send a welcome email if creating a user
        let user = await prisma.user.findUnique({
            where: { email: Customer.email }
        })

        if (!user) {
            // Create a temporary user or handle registration flow
            // For now, we only proceed if user exists or we create a shallow one
            // A better approach is usually to require user to register first, or create with a temp password
            const tempPassword = crypto.randomBytes(8).toString("hex")
            // NOTE: You would need to hash this if storing, but for now let's assume
            // we create the user without a password (auth via magic link) or handle it later.
            // Here accessing prisma directly to avoid circular dips if actions import headers
            user = await prisma.user.create({
                data: {
                    email: Customer.email,
                    name: Customer.full_name || "Aluno Kiwify",
                    // password: hash(tempPassword), // Skip for now
                }
            })
        }

        // Handle Subscription Logic
        if (Subscription) {
            const statusMap: Record<string, 'ACTIVE' | 'CANCELED' | 'PAST_DUE'> = {
                'active': 'ACTIVE',
                'canceled': 'CANCELED',
                'past_due': 'PAST_DUE',
                'trialing': 'ACTIVE' // Treat trial as active
            }

            const dbStatus = statusMap[Subscription.status] || 'ACTIVE'

            // Upsert Subscription
            const subscription = await prisma.subscription.upsert({
                where: { userId: user.id },
                update: {
                    planId: plan.id,
                    provider: 'KIWIFY',
                    externalId: Subscription.id,
                    status: dbStatus,
                    currentPeriodStart: new Date(Subscription.start_date || Date.now()),
                    currentPeriodEnd: new Date(Subscription.next_payment_date || Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                create: {
                    userId: user.id,
                    planId: plan.id,
                    provider: 'KIWIFY',
                    externalId: Subscription.id,
                    status: dbStatus,
                    currentPeriodStart: new Date(Subscription.start_date || Date.now()),
                    currentPeriodEnd: new Date(Subscription.next_payment_date || Date.now() + 30 * 24 * 60 * 60 * 1000),
                }
            })

            await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionId: subscription.id }
            })

            // Grant Credits Logic
            // We verify if this transaction was already processed (prevent double credits)
            // Ideally Kiwify sends a unique transaction ID in the payload to check.
            // Using a simple check: is this a 'order_approved' or 'subscription_renewed'?

            const eventType = webhook_event_type || (payload.Subscription ? "subscription_manual" : "unknown")

            if (eventType === "order_approved" || eventType === "subscription_renewed" || eventType === "subscription_manual") {
                // Add Credits
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        credits: { increment: plan.credits }
                    }
                })

                // Log Transaction
                await prisma.creditTransaction.create({
                    data: {
                        userId: user.id,
                        amount: plan.credits,
                        type: 'SUBSCRIPTION_RENEWAL',
                        description: `Renovação Plano ${plan.name} (Kiwify)`
                    }
                })
            }
        }

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error("Kiwify Webhook Error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
