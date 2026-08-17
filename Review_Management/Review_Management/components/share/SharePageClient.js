"use client";

import { MessageCircle, Copy, Check, ExternalLink, ChevronDown, Share2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const translations = {
    en: {
        shareTitle: "Share",
        helpOthers: "Help others discover this brand",
        generalShare: "General Share",
        viaWhatsapp: "WhatsApp Share",
        copyLink: "Copy Review Link",
        linkCopied: "Link Copied!",
        tryIt: "Try it",
        specificShares: "specific shares",
        sendViaWhatsapp: "Send via WhatsApp",
        noContent: "No content items added yet.",
        noSubtitles: "No subtitles available.",
        infoText1: "This will open your WhatsApp with a draft message. You will be able to select a contact before sending.",
        infoText2: "Zero cost, zero tracked data.",
        defaultDraft: "Hi! 😊 I just had a great experience with [[brandName]]. Could you please take a moment to share your feedback here? It means a lot to them! ⭐\n\nLeave a review here: [[link]]"
    },
    hi: {
        shareTitle: "शेयर करें",
        helpOthers: "इस ब्रांड को खोजने में दूसरों की मदद करें",
        generalShare: "सामान्य शेयर",
        viaWhatsapp: "WhatsApp के द्वारा",
        copyLink: "रिव्यू लिंक कॉपी करें",
        linkCopied: "लिंक कॉपी हो गया!",
        tryIt: "प्रयास करें",
        specificShares: "विशिष्ट शेयर",
        sendViaWhatsapp: "WhatsApp पर भेजें",
        noContent: "अभी तक कोई सामग्री नहीं जोड़ी गई है।",
        noSubtitles: "कोई उपशीर्षक उपलब्ध नहीं है।",
        infoText1: "यह एक ड्राफ्ट मैसेज के साथ आपका WhatsApp खोलेगा। भेजने से पहले आप एक संपर्क चुन सकेंगे।",
        infoText2: "शून्य लागत, शून्य ट्रैक किया गया डेटा।",
        defaultDraft: "नमस्ते! 😊 मुझे अभी-अभी [[brandName]] के साथ बहुत अच्छा अनुभव मिला है। क्या आप कृपया यहां अपनी प्रतिक्रिया साझा करने के लिए थोड़ा समय निकाल सकते हैं? यह उनके लिए बहुत मायने रखता है! ⭐\n\nयहाँ समीक्षा छोड़ें: [[link]]"
    },
    gu: {
        shareTitle: "શેર કરો",
        helpOthers: "અન્ય લોકોને આ બ્રાન્ડ શોધવામાં સહાય કરો",
        generalShare: "સામાન્ય શેર",
        viaWhatsapp: "WhatsApp દ્વારા",
        copyLink: "રિવ્યૂ લિંક કૉપિ કરો",
        linkCopied: "લિંક કૉપિ થઈ ગઈ!",
        tryIt: "પ્રયાસ કરો",
        specificShares: "ચોક્કસ શેર",
        sendViaWhatsapp: "WhatsApp પર મોકલો",
        noContent: "હજુ સુધી કોઈ સામગ્રી ઉમેરવામાં આવી નથી.",
        noSubtitles: "કોઈ ઉપશીર્ષક ઉપલબ્ધ નથી.",
        infoText1: "આ ડ્રાફ્ટ મેસેજ સાથે તમારું WhatsApp ખોલશે. મોકલતા પહેલા તમે સંપર્ક પસંદ કરી શકશો.",
        infoText2: "શૂન્ય કિંમત, શૂન્ય ટ્રૅક કરેલો ડેટા.",
        defaultDraft: "નમસ્તે! 😊 મારો [[brandName]] સાથેનો અનુભવ ખૂબ સારો રહ્યો. શું તમે કૃપા કરીને તમારો પ્રતિસાદ અહીં શેર કરવા માટે થોડો સમય આપી શકો છો? તે તેમના માટે ઘણું મહત્વ ધરાવે છે! ⭐\n\nઅહીં રિવ્યૂ આપો: [[link]]"
    }
};

export default function SharePageClient({ brand }) {
    const [copied, setCopied] = useState(false);
    const [expandedCat, setExpandedCat] = useState(0);
    const [expandedSubCat, setExpandedSubCat] = useState(null);
    const [language, setLanguage] = useState("en");

    const t = translations[language];

    // Prevent hydration mismatch by waiting until component mounts to access window
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter categories by language
    const filteredCategories = (brand.shareCategories || []).filter(cat => (cat.language || "en") === language);

    // The common review link that will be shared
    const reviewLink = mounted ? `${window.location.protocol}//${window.location.host}/r/${brand.slug}` : "";

    const generateWhatsappUrl = (draftTemplate) => {
        const defaultMsg = brand.localizedWhatsappDrafts?.[language] || brand.reviewMessageTemplate || t.defaultDraft;

        let draftMessage = draftTemplate || defaultMsg;
        draftMessage = draftMessage
            .replace("[[link]]", reviewLink)
            .replace("[[brandName]]", brand.name)
            .replace("[[orderId]]", "");

        return `https://wa.me/?text=${encodeURIComponent(draftMessage)}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(reviewLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
        >
            <div className="bg-white rounded-t-[2rem] rounded-b-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden relative">
                {/* Decorative background element */}
                <div
                    className="absolute top-0 left-0 w-full h-24 sm:h-32 opacity-[0.03]"
                    style={{ backgroundColor: brand.primaryColor }}
                />

                {/* Language Selector */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm text-sm">
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

                <div className="p-4 sm:p-10 relative mt-4">
                    {/* Brand Identity */}
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 relative">
                            {brand.logoUrl ? (
                                <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-10 flex items-center justify-center bg-zinc-50">
                                    <img
                                        src={brand.logoUrl}
                                        alt={brand.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-zinc-900 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl relative z-10">
                                    {brand.name[0]}
                                </div>
                            )}
                            {/* Animated ring around logo */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-zinc-200 -m-2"
                            />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-outfit">
                             {brand.name}
                        </h2>
                        {/* <p className="text-zinc-500 mt-2 text-sm sm:text-base font-medium">
                            {brand.slug}{t.helpOthers}
                        </p> */}
                    </div>



                    {/* Dynamic Categories Section */}
                    {filteredCategories.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-zinc-100">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Share2 size={16} /> {t.specificShares}
                            </h3>
                            <div className="space-y-3">
                                {filteredCategories.map((cat, catIdx) => (
                                    <div key={catIdx} className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                                        <button
                                            onClick={() => {
                                                setExpandedCat(expandedCat === catIdx ? null : catIdx);
                                                setExpandedSubCat(null);
                                            }}
                                            className="w-full px-2 md:px-5 py-4 flex items-center justify-between bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
                                        >
                                            <span className="font-bold text-zinc-900 text-left">{cat.title}</span>
                                            <ChevronDown size={20} className={cn("text-zinc-400 transition-transform duration-300", expandedCat === catIdx && "rotate-180")} />
                                        </button>

                                        <AnimatePresence>
                                            {expandedCat === catIdx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden border-t border-zinc-100"
                                                >
                                                    <div className="p-2 space-y-1 bg-white">
                                                        {cat.subtitles?.map((sub, subIdx) => (
                                                            <div key={subIdx} className="rounded-xl overflow-hidden">
                                                                <button
                                                                    onClick={() => setExpandedSubCat(expandedSubCat === subIdx ? null : subIdx)}
                                                                    className="text-left w-full px-0 md:px-4 py-3 flex items-center justify-between text-sm hover:bg-zinc-50 transition-colors rounded-xl"
                                                                >
                                                                    <span className="font-semibold text-zinc-700">{sub.title}</span>
                                                                    <ChevronDown size={16} className={cn("text-zinc-400 transition-transform duration-300", expandedSubCat === subIdx && "rotate-180")} />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {expandedSubCat === subIdx && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="px-0 md:px-4 pb-3 pt-0 space-y-2">
                                                                                {sub.items?.map((item, itemIdx) => (
                                                                                    <div key={itemIdx} className=" border border-zinc-100 rounded-xl p-1 md:p-3 flex flex-col gap-3">
                                                                                        <p className="text-sm font-medium text-zinc-800 leading-snug whitespace-pre-wrap">{item.textContent}</p>
                                                                                        <div className="flex items-center justify-center">
                                                                                            <a
                                                                                                href={generateWhatsappUrl(item.whatsappDraft)}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="w-full sm:w-[50%] py-2.5 bg-[#A22C29] hover:bg-[#902923] text-white rounded-lg flex
                                                                                                        items-center justify-center gap-2 font-bold text-xs uppercase tracking-wide 
                                                                                                        transition-colors active:scale-95 shadow-sm shadow-green-100"
                                                                                            >
                                                                                                <MessageCircle size={16} className="fill-white" />
                                                                                                {t.sendViaWhatsapp}
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                                {(!sub.items || sub.items.length === 0) && (
                                                                                    <p className="text-xs text-zinc-400 text-center py-2 italic">{t.noContent}</p>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        ))}
                                                        {(!cat.subtitles || cat.subtitles.length === 0) && (
                                                            <p className="text-sm text-zinc-400 text-center py-4 italic">{t.noSubtitles}</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Default Actions */}
                    <div className="space-y-4 sm:space-y-0 mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center">
                        {/* WhatsApp Primary Button */}
                        <a
                            href={generateWhatsappUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex mb-0 w-full sm:w-1/2 items-center justify-between p-2 md:p-4 bg-[#A22C29] hover:bg-[#902923] text-white rounded-2xl sm:rounded-[1.5rem] transition-all duration-300 group shadow-lg shadow-black/15 active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                                    <MessageCircle className="fill-white w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <div className="text-left truncate">
                                    <p className="text-white/80 text-[10px] sm:text-xs font-bold text-left tracking-widest truncate uppercase pt-0.5">{t.viaWhatsapp}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform ml-2">
                                <ExternalLink size={16} className="sm:hidden" />
                                <ExternalLink size={20} className="hidden sm:block" />
                            </div>
                        </a>

                        <div className="flex w-full sm:w-1/2 flex-col gap-4">
                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-between p-2 md:p-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 rounded-2xl sm:rounded-[1.5rem] transition-all border border-zinc-200 group active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                        {copied ? <Check size={16} className="text-green-500 sm:w-5 sm:h-5" /> : <Copy size={16} className="sm:w-5 sm:h-5" />}
                                    </div>
                                    <div className="text-left font-bold text-xs sm:text-sm truncate">
                                        {copied ? t.linkCopied : t.copyLink}
                                    </div>
                                </div>
                                {!copied && <div className="text-zinc-400 shrink-0 group-hover:text-zinc-900 italic text-[10px] font-bold ml-2">{t.tryIt}</div>}
                            </button>
                        </div>
                    </div>
                    {/* Info Text */}
                    {/* <div className="mt-8 p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex gap-3">
                            <div className="w-5 h-5 flex-shrink-0 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">!</div>
                            <p className="text-[11px] leading-relaxed text-zinc-500 font-medium">
                                {t.infoText1} <strong>{t.infoText2}</strong>
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>
        </motion.div>
    );
}
