"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FloatingCTA from "./components/FloatingCTA";
import AnnouncementBar from "./components/AnnouncementBar";
import SocialProofTicker from "./components/SocialProofTicker";

// Critical conversion sections — lazy-loaded
const About = lazy(() => import("./components/About"));
const CoachesSection = lazy(() => import("./components/CoachesSection"));
const BranchPreview = lazy(() => import("./components/BranchPreview"));
const AchievementsSection = lazy(() => import("./components/AchievementsSection"));
const Benefits = lazy(() => import("./components/Benefets"));
const ProcessSection = lazy(() => import("./components/ProcessSection"));
const Courses = lazy(() => import("./components/Courses"));
const Gallery = lazy(() => import("./components/Gallery"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQSection = lazy(() => import("./components/FAQSection"));
const CTASection = lazy(() => import("./components/CTASection"));
const SocialRegistration = lazy(() => import("./components/Socialregistration"));
const News = lazy(() => import("./components/News"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const PopupRegistration = lazy(() => import("./components/PopupRegistration"));

const SectionLoader = () => (
  <div
    style={{
      minHeight: "320px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "36px",
        height: "36px",
        border: "3px solid #f3f4f6",
        borderTopColor: "#dc2626",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  </div>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hash = window.location.hash;
    if (!hash) return;
    const targetId = hash.substring(1);
    const headerHeight = 80;
    const attemptScroll = (attempts = 0) => {
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top, behavior: "smooth" });
      } else if (attempts < 15) {
        setTimeout(() => attemptScroll(attempts + 1), 200);
      }
    };
    attemptScroll();
  }, [mounted]);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f3f4f6",
            borderTopColor: "#dc2626",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Popup đăng ký (xuất hiện sau 30 giây) */}
      <Suspense fallback={null}>
        <PopupRegistration />
      </Suspense>

      {/* Announcement bar — dismissible promo */}
      <AnnouncementBar />

      {/* Floating CTA - luôn hiện */}
      <FloatingCTA />

      {/* 1. Header + Hero — eager, critical path */}
      <Header />
      <Hero />

      {/* Social proof ticker — trust signals */}
      <SocialProofTicker />

      {/* 2. Giới thiệu — WE ARE */}
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>

      {/* 3. HLV — AUTHORITY: ai dạy bạn? */}
      <Suspense fallback={<SectionLoader />}>
        <CoachesSection />
      </Suspense>

      {/* 4. Cơ sở — WHERE: học ở đâu? */}
      <Suspense fallback={<SectionLoader />}>
        <BranchPreview />
      </Suspense>

      {/* 5. Thành tích — PROOF: bằng chứng */}
      <Suspense fallback={<SectionLoader />}>
        <AchievementsSection />
      </Suspense>

      {/* 6. Lợi ích — WHY: tại sao học đây? */}
      <Suspense fallback={<SectionLoader />}>
        <Benefits />
      </Suspense>

      {/* 7. Lộ trình — HOW: bắt đầu thế nào? */}
      <Suspense fallback={<SectionLoader />}>
        <ProcessSection />
      </Suspense>

      {/* 8. Khóa học — WHAT & PRICE */}
      <Suspense fallback={<SectionLoader />}>
        <Courses />
      </Suspense>

      {/* 9. Thư viện — EVIDENCE */}
      <Suspense fallback={<SectionLoader />}>
        <Gallery />
      </Suspense>

      {/* 10. Đánh giá — SOCIAL PROOF */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      {/* 11. FAQ — OBJECTION HANDLER */}
      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>

      {/* 12. CTA chính — MAIN CONVERSION */}
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>

      {/* 13. Đăng ký qua mạng xã hội */}
      <Suspense fallback={<SectionLoader />}>
        <SocialRegistration />
      </Suspense>

      {/* 14. Tin tức */}
      <Suspense fallback={<SectionLoader />}>
        <News />
      </Suspense>

      {/* 15. Liên hệ — backup form */}
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
