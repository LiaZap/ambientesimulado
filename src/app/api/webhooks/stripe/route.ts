import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )
    } catch (error) {
        return new NextResponse(`Webhook Error: ${(error as Error).message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId
        const creditsAmount = Number(session.metadata?.credits || 0)

        if (!userId || !creditsAmount) {
            return new NextResponse("Invalid metadata", { status: 200 })
        }

        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    credits: { increment: creditsAmount }
                }
            })

            await prisma.creditTransaction.create({
                data: {
                    userId: userId,
                    amount: creditsAmount,
                    type: 'PURCHASE',
                    description: `Compra de ${creditsAmount} créditos`
                }
            })
        } catch (error) {
            console.error("Error processing credit purchase:", error)
            return new NextResponse("Internal Db Error", { status: 500 })
        }
    }

    return new NextResponse(null, { status: 200 })
}
