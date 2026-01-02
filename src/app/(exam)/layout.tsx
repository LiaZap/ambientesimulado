import { Header } from "@/components/shared/header"
import { getUserProfile } from "@/lib/data"

export default async function ExamLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUserProfile()

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
            {/* Simplified Header or maybe just a Top Bar - reusing Header for consistency but maybe we want less distraction? 
                 For now reusing Header but it might have navigation. 
                 Actually, "Focus Mode" usually implies NO header navigation that leads away easily.
                 But user needs to logout or see profile.
                 Let's stick to a full width structure.
             */}
            <main className="flex-1 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    )
}
