"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface MotionInViewProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "none";
    stagger?: boolean;
}

export default function MotionInView({
    children,
    className,
    delay = 0,
    direction = "up",
    stagger = false
}: MotionInViewProps) {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 30 : direction === "down" ? -30 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay,
                ease: "easeOut",
                staggerChildren: stagger ? 0.1 : 0
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
