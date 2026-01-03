'use server'

import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function createCreditsCheckoutSession(credits: number, priceAmount: number) {
    const session = await auth()
    if (!session?.user?.email || !session?.user?.id) {
        throw new Error("Não autorizado")
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'boleto'],
        line_items: [
            {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: `${credits} Créditos - PRF Ambiente Simulado`,
                        description: 'Pacote de créditos avulsos para correções de redação e planejamento.',
                    },
                    unit_amount: Math.round(priceAmount * 100), // cents
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId: session.user.id,
            credits: credits.toString()
        },
        customer_email: session.user.email,
        success_url: `${origin}/dashboard?credits_success=true`,
        cancel_url: `${origin}/creditos?canceled=true`,
    })

    if (checkoutSession.url) {
        redirect(checkoutSession.url)
    }
}
