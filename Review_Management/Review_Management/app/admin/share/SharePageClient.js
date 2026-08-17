"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, MessageSquare, ExternalLink, QrCode, Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const translations = {
    en: {
        selectBrand: "Please select a brand to view share details.",
        permChannel: "Permanent Review Channel",
        directLink: "Direct Review Link",
        shareWhatsapp: "Share on WhatsApp",
        previewForm: "Preview Form",
        publicSharePage: "Public Share Page",
        publicShareDesc: "Send this page to employees or managers. They can open it on their phones to quickly share the review link with customers in-person.",
        howToUse: "How to use the Share Page",
        step1Title: "Share the URL",
        step1Desc: "Give the \"Public Share Page\" link to your staff or store managers.",
        step2Title: "Open on Mobile",
        step2Desc: "Staff opens the link on their phone at the checkout or service counter.",
        step3Title: "One-Tap Share",
        step3Desc: "They tap \"Share on WhatsApp\" to instantly draft a message to the customer.",
        customDynamic: "Custom Dynamic Share Content",
        customDynamicDesc: "Create specific categories, drop-downs, and custom WhatsApp messages available on your share page.",
        saveChanges: "Save Changes",
        mainTitlePlaceholder: "Main Title (e.g., Advocate Services)",
        subTitlePlaceholder: "Subtitle (e.g., Family Law)",
        contentPlaceholder: "Content text (e.g., Divorce Consultation)",
        waDraftPlaceholder: "WhatsApp Draft Message",
        addContentBtn: "Add Content Item",
        addSubBtn: "Add Subtitle Section",
        addCatBtn: "Add Main Category Title",
    },
    hi: {
        selectBrand: "शेयर विवरण देखने के लिए कृपया एक ब्रांड चुनें।",
        permChannel: "स्थायी रिव्यू चैनल",
        directLink: "सीधा रिव्यू लिंक",
        shareWhatsapp: "WhatsApp पर शेयर करें",
        previewForm: "फॉर्म का पूर्वावलोकन करें",
        publicSharePage: "सार्वजनिक शेयर पेज",
        publicShareDesc: "इस पेज को कर्मचारियों या प्रबंधकों को भेजें। वे इसे अपने फोन पर खोलकर व्यक्तिगत रूप से ग्राहकों के साथ रिव्यू लिंक जल्दी से शेयर कर सकते हैं।",
        howToUse: "शेयर पेज का उपयोग कैसे करें",
        step1Title: "URL शेयर करें",
        step1Desc: "अपने कर्मचारियों या स्टोर प्रबंधकों को \"सार्वजनिक शेयर पेज\" लिंक दें।",
        step2Title: "मोबाइल पर खोलें",
        step2Desc: "कर्मचारी चेकआउट या सर्विस काउंटर पर अपने फोन पर लिंक खोलते हैं।",
        step3Title: "वन-टैप शेयर",
        step3Desc: "वे ग्राहक को तुरंत मैसेज ड्राफ्ट करने के लिए \"WhatsApp पर शेयर करें\" टैप करते हैं।",
        customDynamic: "कस्टम डायनामिक शेयर सामग्री",
        customDynamicDesc: "अपने शेयर पेज पर उपलब्ध विशिष्ट श्रेणियां, ड्रॉप-डाउन और कस्टम WhatsApp संदेश बनाएं।",
        saveChanges: "परिवर्तन सहेजें",
        mainTitlePlaceholder: "मुख्य शीर्षक (उदा., वकील सेवाएँ)",
        subTitlePlaceholder: "उपशीर्षक (उदा., पारिवारिक कानून)",
        contentPlaceholder: "सामग्री पाठ (उदा., तलाक परामर्श)",
        waDraftPlaceholder: "WhatsApp ड्राफ्ट संदेश",
        addContentBtn: "सामग्री आइटम जोड़ें",
        addSubBtn: "उपशीर्षक अनुभाग जोड़ें",
        addCatBtn: "मुख्य श्रेणी शीर्षक जोड़ें",
    },
    gu: {
        selectBrand: "શેર વિગતો જોવા માટે કૃપા કરીને બ્રાન્ડ પસંદ કરો.",
        permChannel: "કાયમી રિવ્યૂ ચેનલ",
        directLink: "સીધી રિવ્યૂ લિંક",
        shareWhatsapp: "WhatsApp પર શેર કરો",
        previewForm: "ફોર્મનું પૂર્વાવલોકન કરો",
        publicSharePage: "સાર્વજનિક શેર પેજ",
        publicShareDesc: "આ પેજ કર્મચારીઓ અથવા મેનેજરોને મોકલો. તેઓ ગ્રાહકો સાથે વ્યક્તિગત રીતે ઝડપથી રિવ્યૂ લિંક શેર કરવા માટે તેને તેમના ફોન પર ખોલી શકે છે.",
        howToUse: "શેર પેજનો ઉપયોગ કેવી રીતે કરવો",
        step1Title: "URL શેર કરો",
        step1Desc: "તમારા સ્ટાફ અથવા સ્ટોર મેનેજરોને \"સાર્વજનિક શેર પેજ\" લિંક આપો.",
        step2Title: "મોબાઇલ પર ખોલો",
        step2Desc: "સ્ટાફ ચેકઆઉટ અથવા સર્વિસ કાઉન્ટર પર તેમના ફોન પર લિંક ખોલે છે.",
        step3Title: "વન-ટેપ શેર",
        step3Desc: "ગ્રાહકને તરત જ ડ્રાફ્ટ મેસેજ મોકલવા માટે તેઓ \"WhatsApp પર શેર કરો\" પર ટેપ કરે છે.",
        customDynamic: "કસ્ટમ ડાયનેમિક શેર સામગ્રી",
        customDynamicDesc: "તમારા શેર પેજ પર ઉપલબ્ધ ચોક્કસ શ્રેણીઓ, ડ્રોપ-ડાઉન્સ અને કસ્ટમ WhatsApp સંદેશાઓ બનાવો.",
        saveChanges: "ફેરફારો સાચવો",
        mainTitlePlaceholder: "મુખ્ય શીર્ષક (દા.ત., વકીલ સેવાઓ)",
        subTitlePlaceholder: "ઉપશીર્ષક (દા.ત., કૌટુંબિક કાયદો)",
        contentPlaceholder: "સામગ્રી ટેક્સ્ટ (દા.ત., છૂટાછેડા પરામર્શ)",
        waDraftPlaceholder: "WhatsApp ડ્રાફ્ટ સંદેશ",
        addContentBtn: "સામગ્રી આઇટમ ઉમેરો",
        addSubBtn: "ઉપશીર્ષક વિભાગ ઉમેરો",
        addCatBtn: "મુખ્ય શ્રેણી શીર્ષક ઉમેરો",
    }
};

export default function SharePageClient({ brand }) {
    const [copiedType, setCopiedType] = useState(null); // 'review' | 'share' | null
    const [baseUrl, setBaseUrl] = useState("");
    const [language, setLanguage] = useState("en");

    // Dynamic Form State
    const [categories, setCategories] = useState(brand?.shareCategories || []);
    const [localizedDrafts, setLocalizedDrafts] = useState(brand?.localizedWhatsappDrafts || { en: '', hi: '', gu: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setBaseUrl(window.location.origin);
        }
    }, []);

    const t = translations[language];

    if (!brand) {
        return (
            <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 shadow-sm">
                <p className="text-zinc-500">Please select a brand to view share details.</p>
            </div>
        );
    }

    const publicReviewUrl = `${baseUrl}/r/${brand.slug || brand.id}`;
    const sharePageUrl = `${baseUrl}/share/${brand.slug || brand.id}`;

    const handleCopy = async (url, type) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }
            toast.success(`${type} copied to clipboard!`);
            setCopiedType(type === "Review link" ? "review" : "share");
            setTimeout(() => setCopiedType(null), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            toast.error("Failed to copy link");
        }
    };

    const handleWhatsAppShare = () => {
        const reviewLink = publicReviewUrl;
        const brandName = brand.name;

        const defaultEnMsg = `Hi! 😊 I just had a great experience with ${brandName}. Could you please take a moment to share your feedback here? ⭐\n\nLeave a review here: ${reviewLink}`;
        
        // Priority sequence: 1. Specific language override, 2. Global brand template, 3. Hardcoded default
        const draftTemplate = localizedDrafts[language] || brand.reviewMessageTemplate || defaultEnMsg;

        let draftMessage = draftTemplate
            .replace("[[link]]", reviewLink)
            .replace("[[brandName]]", brandName)
            .replace("[[orderId]]", "");

        window.open(`https://wa.me/?text=${encodeURIComponent(draftMessage)}`, "_blank");
        toast.success("Opening WhatsApp...");
    };

    // --- Dynamic Form Handlers ---
    const addCategory = () => {
        setCategories([...categories, { language: language, title: "", subtitles: [] }]);
    };

    const updateCategory = (cIndex, value) => {
        const newCats = [...categories];
        newCats[cIndex].title = value;
        setCategories(newCats);
    };

    const removeCategory = (cIndex) => {
        setCategories(categories.filter((_, i) => i !== cIndex));
    };

    const addSubtitle = (cIndex) => {
        const newCats = [...categories];
        newCats[cIndex].subtitles.push({ title: "", items: [] });
        setCategories(newCats);
    };

    const updateSubtitle = (cIndex, sIndex, value) => {
        const newCats = [...categories];
        newCats[cIndex].subtitles[sIndex].title = value;
        setCategories(newCats);
    };

    const removeSubtitle = (cIndex, sIndex) => {
        const newCats = [...categories];
        newCats[cIndex].subtitles = newCats[cIndex].subtitles.filter((_, i) => i !== sIndex);
        setCategories(newCats);
    };

    const addItem = (cIndex, sIndex) => {
        const newCats = [...categories];
        newCats[cIndex].subtitles[sIndex].items.push({ textContent: "", whatsappDraft: "" });
        setCategories(newCats);
    };

    const updateItem = (cIndex, sIndex, iIndex, field, value) => {
        const newCats = [...categories];
        newCats[cIndex].subtitles[sIndex].items[iIndex][field] = value;
        setCategories(newCats);
    };

    const removeItem = (cIndex, sIndex, iIndex) => {
        const newCats = [...categories];
        newCats[cIndex].subtitles[sIndex].items = newCats[cIndex].subtitles[sIndex].items.filter((_, i) => i !== iIndex);
        setCategories(newCats);
    };

    const handleSaveCategories = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/brand-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bid: brand.id,
                    shareCategories: categories,
                    localizedWhatsappDrafts: localizedDrafts
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Share preferences saved successfully!");
            } else {
                toast.error(data.error || "Failed to save");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid gap-8">
            {/* Language Selector (Global for this view) */}
            <div className="flex justify-end mb-[-1rem]">
                <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm text-sm">
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

            {/* Quick Share Card */}
            <div className="bg-white rounded-[32px] border border-zinc-200 p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Brand Preview */}
                    <div className="w-32 h-32 rounded-3xl border border-zinc-100 shadow-sm flex items-center justify-center p-4 bg-zinc-50 shrink-0">
                        {brand.logoUrl ? (
                            <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="text-4xl font-black text-zinc-300 uppercase">{brand.name[0]}</span>
                        )}
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left w-full">
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-1">{brand.name}</h3>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{t.permChannel}</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{t.directLink}</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 h-12 flex items-center text-sm font-medium text-zinc-600 truncate">
                                        {publicReviewUrl}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(publicReviewUrl, "Review link")}
                                        className="w-12 h-12 flex items-center justify-center bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors shrink-0"
                                    >
                                        {copiedType === "review" ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={handleWhatsAppShare}
                                className="flex-1 min-w-[200px] h-14 bg-[#A22C29] hover:bg-[#902923] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-lg shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <MessageSquare size={20} fill="white" />
                                {t.shareWhatsapp}
                            </button>

                            <a
                                href={publicReviewUrl}
                                target="_blank"
                                className="h-14 px-6 bg-zinc-900 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm hover:bg-zinc-800 transition-all shrink-0"
                            >
                                <ExternalLink size={18} />
                                {t.previewForm}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Public Share Page Card */}
            <div className="bg-zinc-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="p-4 bg-white rounded-2xl shrink-0">
                        <QrCode size={64} className="text-black" />
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <h3 className="text-xl font-bold mb-1">{t.publicSharePage}</h3>
                            <p className="text-zinc-400 text-sm">{t.publicShareDesc}</p>
                        </div>

                        <div className="flex gap-2 max-w-md mx-auto md:mx-0">
                            <div className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 h-11 flex items-center text-xs font-mono text-zinc-300 truncate">
                                {sharePageUrl}
                            </div>
                            <button
                                onClick={() => handleCopy(sharePageUrl, "Share page link")}
                                className="w-11 h-11 flex items-center justify-center bg-white text-black rounded-xl hover:bg-zinc-100 transition-all shrink-0 font-bold"
                            >
                                {copiedType === "share" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instruction Card */}
            <div className="bg-white rounded-[32px] border border-zinc-200 p-8 shadow-sm">
                <h4 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Share2 size={18} className="text-zinc-400" />
                    {t.howToUse}
                </h4>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-900">1</div>
                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{t.step1Title}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">{t.step1Desc}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-900">2</div>
                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{t.step2Title}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">{t.step2Desc}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-900">3</div>
                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{t.step3Title}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">{t.step3Desc}</p>
                    </div>
                </div>
            </div>

            {/* Dynamic Content Builder */}
            <div className="bg-white rounded-[32px] border border-zinc-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                            <MessageSquare size={18} className="text-zinc-400" />
                            {t.customDynamic}
                        </h4>
                        <p className="text-sm text-zinc-500 mt-1">{t.customDynamicDesc}</p>
                    </div>
                    <button
                        onClick={handleSaveCategories}
                        disabled={isSaving}
                        className="h-10 px-3 bg-zinc-900 text-white rounded-xl flex items-center gap-2 font-bold text-[11px] hover:bg-zinc-800 disabled:opacity-50 transition-all"
                    >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {t.saveChanges}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50/50 mb-6">
                        <label className="block text-sm font-bold text-zinc-900 mb-2">
                            General WhatsApp Message Override ({language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Gujarati'})
                        </label>
                        <p className="text-xs text-zinc-500 mb-3">Leave blank to use default template. This message acts as the draft for the big green 'Share on WhatsApp' button.</p>
                        <textarea
                            value={localizedDrafts[language] || ""}
                            onChange={(e) => setLocalizedDrafts({ ...localizedDrafts, [language]: e.target.value })}
                            placeholder="Type your default message for this language..."
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 min-h-[100px] resize-y"
                        />
                    </div>

                    {categories.map((cat, cIndex) => {
                        if ((cat.language || "en") !== language) return null;
                        return (
                            <div key={cIndex} className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                                <div className="flex gap-3 mb-4 items-center">
                                    {/* Hidden language selector since we now filter by language */}
                                    <input
                                        type="text"
                                        value={cat.title}
                                        onChange={(e) => updateCategory(cIndex, e.target.value)}
                                        placeholder={t.mainTitlePlaceholder}
                                        className="flex-1 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    />
                                    <button onClick={() => removeCategory(cIndex)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="pl-6 border-l-2 border-zinc-200 space-y-4">
                                    {cat.subtitles.map((sub, sIndex) => (
                                        <div key={sIndex} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
                                            <div className="flex gap-3 mb-4">
                                                <input
                                                    type="text"
                                                    value={sub.title}
                                                    onChange={(e) => updateSubtitle(cIndex, sIndex, e.target.value)}
                                                    placeholder={t.subTitlePlaceholder}
                                                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                                />
                                                <button onClick={() => removeSubtitle(cIndex, sIndex)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="pl-6 border-l-2 border-zinc-100 space-y-3">
                                                {sub.items.map((item, iIndex) => (
                                                    <div key={iIndex} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex gap-3 items-start relative group">
                                                        <div className="flex-1 space-y-2">
                                                            <textarea
                                                                value={item.textContent}
                                                                onChange={(e) => updateItem(cIndex, sIndex, iIndex, 'textContent', e.target.value)}
                                                                placeholder={t.contentPlaceholder}
                                                                rows={2}
                                                                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 min-h-[44px] resize-y"
                                                            />
                                                            <textarea
                                                                value={item.whatsappDraft}
                                                                onChange={(e) => updateItem(cIndex, sIndex, iIndex, 'whatsappDraft', e.target.value)}
                                                                placeholder={t.waDraftPlaceholder}
                                                                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                                            />
                                                        </div>
                                                        <button onClick={() => removeItem(cIndex, sIndex, iIndex)} className="p-2 text-zinc-400 hover:text-red-500 rounded-lg">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addItem(cIndex, sIndex)}
                                                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mt-2"
                                                >
                                                    <Plus size={14} /> {t.addContentBtn}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addSubtitle(cIndex)}
                                        className="text-sm font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 pt-2"
                                    >
                                        <Plus size={16} /> {t.addSubBtn}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={addCategory}
                        className="w-full py-4 border-2 border-dashed border-zinc-300 rounded-2xl text-sm font-bold text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> {t.addCatBtn}
                    </button>
                </div>
            </div>
        </div>
    );
}
