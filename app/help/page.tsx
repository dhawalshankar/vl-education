"use client";
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, BookOpen, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  { q: 'How do I enroll in a course?', a: 'Simply sign up for a free account, browse the language you want to learn, and click "Enroll" on any course. Enrollment is free for all currently available courses.' },
  { q: 'Is VartaLang free to use?', a: 'Yes! VartaLang is currently in Beta and all content is freely accessible to registered learners. Premium features may be introduced in the future.' },
  { q: 'How do I track my progress?', a: 'Once you open a course, you can mark each resource as complete using the checkmark button. Your progress percentage is saved automatically in your browser.' },
  { q: 'Can I access VartaLang on my phone?', a: 'Yes! VartaLang is fully responsive and works on all devices — phone, tablet, and desktop.' },
  { q: 'What languages are available?', a: 'Currently we support Hindi, English, Tamil, Telugu, Bengali, and Marathi. We\'re actively adding more languages.' },
  { q: 'How do I prepare for IELTS on VartaLang?', a: 'Navigate to Learn → English, and look for the "Exam Preparation" level courses. These contain curated resources specifically for IELTS preparation.' },
  { q: 'I forgot my password. What do I do?', a: 'Click "Forgot password?" on the login page and enter your registered email. You\'ll receive a reset link shortly.' },
  { q: 'How do I become an instructor?', a: 'Register with the "Instructor" role during signup. Your account will be reviewed and you\'ll gain access to course creation tools once approved.' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/90 to-[#0a0908] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-20">

        <Link href="/home" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-base sm:text-lg text-stone-400">Find answers to common questions</p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-700/50 bg-stone-900/60 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-14">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-stone-500">No results found for "{search}"</div>
          ) : (
            filtered.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-stone-800/30 transition-colors"
                >
                  <span className="font-kalam text-lg font-bold text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-stone-400 text-sm leading-relaxed border-t border-stone-700/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <a href="mailto:support@cosmoindiaprakashan.in" className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30 transition-colors">
              <Mail className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-kalam text-lg font-bold text-white mb-1">Email Support</h3>
              <p className="text-stone-400 text-sm">support@cosmoindiaprakashan.in</p>
              <p className="text-stone-500 text-xs mt-1">Response within 24 hours</p>
            </div>
          </a>

          <div className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-kalam text-lg font-bold text-white mb-1">Browse Courses</h3>
              <p className="text-stone-400 text-sm">Find learning resources</p>
              <Link href="/learn" className="text-amber-400 text-xs mt-1 hover:text-amber-300 transition-colors">
                Go to Learn →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
