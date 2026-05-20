"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";

// Eager-loaded new sections (small, critical for conversion)
import FloatingCTA from "./components/FloatingCTA";

// Lazy load sections
const About = lazy(() => import("./components/About"));
const BranchPreview = lazy(() => import("./components/BranchPreview"));
const Benefits = lazy(() => import("./components/Benefets"));
const News = lazy(() => import("./components/News"));
const Courses = lazy(() => import("./components/Courses"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const CTASection = lazy(() => import("./components/CTASection"));
const SocialRegistration = lazy(
  () => import("./components/Socialregistration")
);
const Gallery = lazy(() => import("./components/Gallery"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const PopupRegistration = lazy(() => import("./components/PopupRegistration"));

// Section loading placeholder
const SectionLoader = () => (
  <div
    style={{
      minHeight: "320px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
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

  // Scroll to hash target after lazy sections have rendered
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
      {/* Popup (lazy, appears on scroll) */}
      <Suspense fallback={null}>
        <PopupRegistration />
      </Suspense>

      {/* Floating CTA button (eager, appears after scroll threshold) */}
      <FloatingCTA />

      {/* Header + Hero — eager */}
      <Header />
      <Hero />

      {/* About */}
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>

      {/* Branch preview — new section */}
      <Suspense fallback={<SectionLoader />}>
        <BranchPreview />
      </Suspense>

      {/* Benefits */}
      <Suspense fallback={<SectionLoader />}>
        <Benefits />
      </Suspense>

      {/* News */}
      <Suspense fallback={<SectionLoader />}>
        <News />
      </Suspense>

      {/* Courses */}
      <Suspense fallback={<SectionLoader />}>
        <Courses />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      {/* CTA / Registration section — primary conversion point */}
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>

      {/* Social Registration */}
      <Suspense fallback={<SectionLoader />}>
        <SocialRegistration />
      </Suspense>

      {/* Gallery */}
      <Suspense fallback={<SectionLoader />}>
        <Gallery />
      </Suspense>

      {/* Contact (secondary form / info) */}
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
