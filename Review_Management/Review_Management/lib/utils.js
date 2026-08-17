import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function generateToken() {
    return Math.random().toString(36).substring(2, 14); // 12 characters, safe for WhatsApp buttons (limit 15)
}
