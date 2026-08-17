"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Zap,
  Check,
  ChevronRight,
  ShieldAlert,
  BarChart4,
  Target,
  Menu,
  X,
  Plus,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-900 font-sans selection:bg-sky-200 overflow-x-hidden">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-sky-100 py-4 shadow-sm" : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-md shadow-black/10">
              <Image
                src="/logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">Review</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-black">
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-slate-950 text-white text-sm font-semibold rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Get Started
            </Link>
            <button
              className="md:hidden text-zinc-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[90] bg-white pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-zinc-900"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-zinc-100" />
              <Link
                href="/login"
                className="text-lg font-medium text-zinc-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="w-full py-4 bg-zinc-900 text-white text-center font-bold rounded-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
        {selectedPlan && (
          <ContactModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="pt-44 pb-28 px-6 relative bg-[#D6D5C9]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-sky-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-8 shadow-sm">
                <Plus size={12} />
                Used by 500+ global brands
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-8 font-display">
                Build a reputation that <br className="hidden md:block" />
                <span className="text-[#A22C29]">sells for you.</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Capture five-star Google reviews automatically and shield your brand from negative feedback through a private feedback funnel.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white font-semibold rounded-xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group shadow-sm"
                >
                  Start your funnel
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  View demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-[#D6D5C9] scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Intelligent automation.</h2>
              <p className="text-zinc-500 max-w-xl mx-auto">
                Everything you need to automate your social proof and manage customer satisfaction at scale.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ShieldAlert className="text-blue-600" />}
                title="Feedback Shield"
                description="Automatically redirect negative signals to a private resolution channel before they reach public platforms."
              />
              <FeatureCard
                icon={<Target className="text-blue-600" />}
                title="Smart Targeting"
                description="Happy customers are guided to leave reviews on Google, Trustpilot, or Facebook with just one click."
              />
              <FeatureCard
                icon={<BarChart4 className="text-blue-600" />}
                title="Unified Analytics"
                description="Monitor sentiment trends and review volume across all your brands from a single dashboard."
              />
            </div>
          </div>
        </section>

        {/* How it Works / Architecture */}
        <section id="how-it-works" className="py-24 px-6 overflow-hidden scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-black rounded-2xl p-8 md:p-12 text-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800/20 blur-3xl rounded-full"></div>
                  <div className="relative space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Zap className="text-yellow-400" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Process Flow</p>
                        <p className="text-lg font-bold">Automated Redirect</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5 flex items-center justify-between">
                        <span className="text-sm">Rating: 5 Stars</span>
                        <Check className="text-green-400" size={18} />
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between opacity-50">
                        <span className="text-sm italic">Directing to Google Reviews...</span>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="p-6 bg-yellow-400 text-black rounded-2xl">
                      <p className="text-sm font-bold mb-1">98.4% Accuracy</p>
                      <p className="text-xs opacity-75">Customer sentiment correctly identified and routed.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-8">
                <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs">The Architecture</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Scale across brands with zero friction.</h2>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  Manage one store or five thousand from a single login. Our multi-tenant architecture is built to handle complex brand structures while keeping the experience simple for you.
                </p>
                <ul className="space-y-4">
                  {[
                    "Multi-brand dashboard",
                    "Automated review routing",
                    "Custom feedback funnels",
                    "Enterprise-grade security"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-medium">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-zinc-50 scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Transparent pricing.</h2>
              <p className="text-zinc-500">Choose the plan that matches your business velocity.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard
                title="Scale"
                price="49"
                features={["1 Brand", "1,000 Credits", "Standard Funnel", "Email Support"]}
                onSelect={() => setSelectedPlan("Scale")}
              />
              <PricingCard
                title="Growth"
                price="119"
                highlighted
                features={["5 Brands", "5,000 Credits", "Premium Funnel", "Priority Support", "WhatsApp Integration"]}
                onSelect={() => setSelectedPlan("Growth")}
              />
              <PricingCard
                title="Enterprise"
                price="499"
                features={["Unlimited Brands", "Unlimited Credits", "Custom Funnel", "24/7 Dedicated Support", "White-label API"]}
                onSelect={() => setSelectedPlan("Enterprise")}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-zinc-900 rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to automate your <br /> social proof?</h2>
              <p className="text-lg text-zinc-400 mb-12 max-w-xl mx-auto">
                Join hundreds of brands using Review to lead their market rankings.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all group"
              >
                Create your account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative pt-32 pb-16 px-6 bg-black text-white selection:bg-gray-800 overflow-hidden">
        {/* Aesthetic accents */}
        <div className="absolute top-0 left-0 w-full h-px bg-[#B9BAA3]/30"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-white/15"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            <div className="space-y-12">
              <div className="space-y-8 text-center sm:text-left">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="w-14 h-14 rounded-[20px] flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Image
                      src="/logo.png"
                      alt="Review Logo"
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-4xl font-bold tracking-tighter font-display text-white">Review</span>
                </Link>
                <p className="text-zinc-400 text-2xl leading-relaxed max-w-md font-light">
                  Scale your digital reputation with intelligent social proof automation.
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4">
                {['Insta', 'X', 'In', 'Git'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="group relative w-14 h-14 rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-500 transition-all duration-500 hover:border-white hover:text-white"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">{social}</span>
                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[40px] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.02] blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight">Join the evolution.</h4>
              <p className="text-zinc-500 mb-10 text-lg">Scalable reputation management for modern brands.</p>

              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="flex-1 bg-white/[0.03] border border-zinc-800 text-white rounded-2xl px-8 py-5 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-zinc-600 text-base"
                />
                <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-95 text-base shadow-[0_4px_20px_rgba(255,255,255,0.1)]">
                  Start Free
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 border-t border-zinc-900 pt-24 mb-32">
            <FooterColumn
              title="Product"
              links={[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Enterprise', href: '#' },
                { label: 'Security', href: '#' },
              ]}
            />
            <FooterColumn
              title="Identity"
              links={[
                { label: 'About', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Principles', href: '#' },
                { label: 'Brand', href: '#' },
              ]}
            />
            <FooterColumn
              title="Learning"
              links={[
                { label: 'Docs', href: '#' },
                { label: 'Guides', href: '#' },
                { label: 'API Reference', href: '#' },
                { label: 'Status', href: '#' },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Cookies', href: '#' },
              ]}
            />
          </div>

          <div className="pt-12 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-8 text-[11px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
            <p>© {new Date().getFullYear()} Review</p>
            <div className="flex items-center gap-10">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Systems Normal
              </span>
              <span className="text-zinc-800">|</span>
              <a href="#" className="hover:text-white transition-colors">Global Headquarters</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 bg-white rounded-[22px] border border-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-200/60 group">
      <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, highlighted, features, onSelect }) {
  return (
    <div className={`p-8 rounded-2xl border transition-all flex flex-col h-full ${highlighted
      ? "bg-white border-black shadow-xl scale-105 z-10"
      : "bg-white border-gray-200"
      }`}>
      {highlighted ? (
        <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-6 w-max">
          Most Popular
        </span>
      ) : (
        <div className="h-[26px] mb-6" aria-hidden="true"></div>
      )}

      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">{title}</p>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-5xl font-bold">${price}</span>
        <span className="text-gray-500 font-medium">/mo</span>
      </div>

      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm font-medium">
            <Check size={16} className="text-black shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-4 text-center font-medium rounded-xl transition-all block mt-auto ${highlighted
          ? "bg-black text-white hover:bg-gray-800 shadow-md"
          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
      >
        Choose {title}
      </button>
    </div>
  );
}

function ContactModal({ plan, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message"),
      plan: plan
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-2xl p-8 md:p-10 shadow-xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Request Sent!</h3>
            <p className="text-zinc-500 mb-8">
              Thanks for your interest in the <span className="text-zinc-900 font-bold">{plan}</span> plan. We&apos;ll be in touch shortly.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Selected Plan: {plan}
              </span>
              <h3 className="text-3xl font-bold tracking-tight">Get in touch</h3>
              <p className="text-zinc-500 mt-2">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Name</label>
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Phone</label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Email</label>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Message (Optional)</label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell us about your needs..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="space-y-8">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 group/link"
            >
              <span className="relative">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover/link:w-full"></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
