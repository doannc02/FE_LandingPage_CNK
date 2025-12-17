"use client";

import { lazy, useEffect, useState, useRef, Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

// Loading component with better UX
const LoadingSpinner = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">Đang tải...</p>
    </div>
  </div>
);

// Custom hook for intersection observer with better performance
const useIsVisible = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Only create observer if element hasn't been visible yet
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect observer once element is visible (won't observe again)
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before element enters viewport
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, options]);

  return { ref, isVisible };
};

// Lazy load components with prefetch
const LazyAbout = lazy(() => import("./components/About"));
const LazyNews = lazy(() => import("./components/News"));
const LazyCourses = lazy(() => import("./components/Courses"));
const LazyContact = lazy(() => import("./components/Contact"));
const LazyGallery = lazy(() => import("./components/Gallery"));

// Optimized lazy section with better loading state
interface LazySectionProps {
  component: React.ComponentType<any>;
  minHeight?: string;
  [key: string]: any;
}

const LazySection = ({
  component: Component,
  minHeight = "400px",
  ...props
}: LazySectionProps) => {
  const { ref, isVisible } = useIsVisible();

  return (
    <div
      ref={ref}
      className="lazy-section"
      style={{ minHeight: isVisible ? "auto" : minHeight }}
    >
      {isVisible ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Component {...props} />
        </Suspense>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative">
      <Header />
      <Hero />

      {/* Lazy load sections with optimized intersection observer */}
      <LazySection component={LazyAbout} minHeight="500px" />
      <LazySection component={LazyNews} minHeight="600px" />
      <LazySection component={LazyCourses} minHeight="700px" />
      <LazySection component={LazyGallery} minHeight="600px" />
      <LazySection component={LazyContact} minHeight="400px" />

      <Footer />
    </main>
  );
}
