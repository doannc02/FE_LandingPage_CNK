'use client';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Courses from './components/Courses';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Gallery from './components/Gallery';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <News />
      <Courses />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}