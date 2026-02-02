"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";

// Lazy load components
const About = lazy(() => import("./components/About"));
const Benefits = lazy(() => import("./components/Benefets"));
const News = lazy(() => import("./components/News"));
const Courses = lazy(() => import("./components/Courses"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Gallery = lazy(() => import("./components/Gallery"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const PopupRegistration = lazy(() => import("./components/PopupRegistration"));
const SocialRegistration = lazy(
  () => import("./components/Socialregistration")
);

// Loading component for Suspense fallback
const SectionLoader = () => (
  <div
    style={{
      minHeight: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "3px solid #f3f4f6",
        borderTopColor: "#f87614",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    ></div>
  </div>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple loading state
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #333",
            borderTopColor: "#C41E3A",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="relative">
      <Suspense fallback={null}>
        <PopupRegistration />
      </Suspense>

      <Header />
      <Hero />

      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Benefits />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <News />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Courses />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <SocialRegistration />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Gallery />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
