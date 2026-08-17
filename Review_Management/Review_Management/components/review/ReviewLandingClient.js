"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle2, ChevronRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";

const translations = {
    en: {
        title: "Review & Feedback",
        experience: "How was your experience?",
        tapStar: "Tap a star to give us your rating",
        valueHonesty: "We value your honesty",
        tellUs: "Please tell us what we could do better.",
        placeholder: "Write your feedback here...",
        submit: "Submit Feedback",
        successTitle: "Thank you!",
        successDesc: "Your feedback has been received and will be reviewed by our team.",
        safeSecure: "Safe & Secure",
        privacyFirst: "Privacy First"
    },
    hi: {
        title: "समीक्षा और प्रतिक्रिया",
        experience: "आपका अनुभव कैसा रहा?",
        tapStar: "हमें अपनी रेटिंग देने के लिए एक स्टार टैप करें",
        valueHonesty: "हम आपकी ईमानदारी की कद्र करते हैं",
        tellUs: "कृपया हमें बताएं कि हम क्या बेहतर कर सकते हैं।",
        placeholder: "अपनी प्रतिक्रिया यहाँ लिखें...",
        submit: "प्रतिक्रिया जमा करें",
        successTitle: "धन्यवाद!",
        successDesc: "आपकी प्रतिक्रिया प्राप्त हो गई है और हमारी टीम द्वारा इसकी समीक्षा की जाएगी।",
        safeSecure: "सुरक्षित और संरक्षित",
        privacyFirst: "गोपनीयता पहले"
    },
    gu: {
        title: "સમીક્ષા અને પ્રતિસાદ",
        experience: "તમારો અનુભવ કેવો રહ્યો?",
        tapStar: "અમને તમારું રેટિંગ આપવા માટે સ્ટાર પર ટેપ કરો",
        valueHonesty: "અમે તમારી પ્રામાણિકતાની કદર કરીએ છીએ",
        tellUs: "કૃપા કરીને અમને જણાવો કે અમે શું વધુ સારું કરી શકીએ.",
        placeholder: "તમારો પ્રતિસાદ અહીં લખો...",
        submit: "પ્રતિસાદ સબમિટ કરો",
        successTitle: "આભાર!",
        successDesc: "તમારો પ્રતિસાદ પ્રાપ્ત થયો છે અને અમારી ટીમ દ્વારા તેની સમીક્ષા કરવામાં આવશે.",
        safeSecure: "સુરક્ષિત અને સલામત",
        privacyFirst: "પ્રથમ ગોપનીયતા"
    }
};

export default function ReviewLandingClient({ brand, token }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState("rating");
    const [language, setLanguage] = useState("en");

    const t = translations[language];

    const handleRating = async (value) => {
        setRating(value);
        if (value >= 4) {
            await submitReview(value, "", true);
        } else {
            setStep("feedback");
        }
    };

    const submitReview = async (value, text, isPublic) => {
        setIsSubmitting(true);
        try {
            await axios.post("/api/reviews/submit", {
                token,
                rating: value,
                feedback: text,
                isPublic
            });

            if (value >= 4 && brand.googlePlaceId) {
                window.location.href = `https://search.google.com/local/writereview?placeid=${brand.googlePlaceId}`;
            } else {
                setStep("success");

            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClick = () => {

    }

    return (
        <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden relative">

                {/* Language Selector */}
                <div className="absolute top-6 right-6 z-10">
                    <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm text-sm">
                        <Globe size={14} className="text-zinc-500" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-zinc-700 font-medium outline-none cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="gu">ગુજરાતી</option>
                        </select>
                    </div>
                </div>

                {/* Brand Header */}
                <div className="p-8 pb-4 text-center border-b border-zinc-50 relative mt-6">
                    <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-center bg-zinc-50">
                        {brand.logoUrl ? (
                            <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white text-2xl font-bold">
                                {brand.name[0]}
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">{brand.name}</h2>
                    <p className="text-zinc-500 text-sm mt-1">{t.title}</p>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === "rating" && (
                            <motion.div
                                key="rating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{t.experience}</h3>
                                <p className="text-zinc-500 text-sm mb-8">{t.tapStar}</p>

                                <div className="flex justify-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => handleRating(star)}
                                            className="p-1 transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={40}
                                                className={cn(
                                                    "transition-colors",
                                                    (hoveredRating || rating) >= star
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "fill-zinc-50 text-zinc-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === "feedback" && (
                            <motion.div
                                key="feedback"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-zinc-900">{t.valueHonesty}</h3>
                                    <p className="text-zinc-500 text-sm">{t.tellUs}</p>
                                </div>

                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={t.placeholder}
                                    className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all resize-none text-zinc-800 text-sm"
                                />

                                <button
                                    onClick={() => submitReview(rating, feedback, false)}
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t.submit}
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-2">{t.successTitle}</h3>
                                <p className="text-zinc-500 text-sm max-w-[280px] mx-auto">
                                    {t.successDesc}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <span>{t.safeSecure}</span>
                <span>•</span>
                <span>{t.privacyFirst}</span>
            </div>
        </div>
    );
}
