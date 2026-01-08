"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface CountdownTimerProps {
    targetDate: string
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
        <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-lg w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg shadow-black/50">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl md:text-3xl font-bold text-yellow-500 absolute"
                >
                    {String(value).padStart(2, "0")}
                </motion.span>
            </AnimatePresence>
        </div>
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mt-1 font-semibold">
            {label}
        </span>
    </div>
)

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date()

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                }
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        setTimeLeft(calculateTimeLeft())

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="w-full bg-slate-950 border-b border-slate-800/50 py-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 relative z-10">

                <div className="flex items-center gap-3 text-center md:text-left">
                    <div className="p-2 bg-red-500/10 rounded-full animate-pulse">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-yellow-500 font-bold text-sm md:text-base uppercase tracking-wider">
                            Oferta de Pré-Lançamento
                        </p>
                        <p className="text-slate-400 text-xs md:text-sm">
                            O valor promocional encerra em breve.
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <TimeUnit value={timeLeft.days} label="Dias" />
                    <span className="text-slate-700 font-bold text-xl -mt-4">:</span>
                    <TimeUnit value={timeLeft.hours} label="Horas" />
                    <span className="text-slate-700 font-bold text-xl -mt-4">:</span>
                    <TimeUnit value={timeLeft.minutes} label="Min" />
                    <span className="text-slate-700 font-bold text-xl -mt-4">:</span>
                    <TimeUnit value={timeLeft.seconds} label="Seg" />
                </div>

            </div>
        </div>
    )
}
