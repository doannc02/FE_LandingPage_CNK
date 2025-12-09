'use client';

import { lazy, useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

const useIsVisible = (ref: React.RefObject<Element>) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  
  return isVisible;
};

const LazyAbout = lazy(() => import('./components/About'));
const LazyNews = lazy(() => import('./components/News'));
const LazyCourses = lazy(() => import('./components/Courses'));
const LazyContact = lazy(() => import('./components/Contact'));
const LazyGallery = lazy(() => import('./components/Gallery'));

const LazySection = ({ component: Component, ...props }: { component: React.ComponentType<any>; [key: string]: any }) => {
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);
  
  return (
    <div ref={ref} className="lazy-section">
      {isVisible ? (
        <Component {...props} />
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      
      <LazySection component={LazyAbout} />
      <LazySection component={LazyNews} />
      <LazySection component={LazyCourses} />
      <LazySection component={LazyGallery} />
      <LazySection component={LazyContact} />
      
      <Footer />
    </main>
  );
}