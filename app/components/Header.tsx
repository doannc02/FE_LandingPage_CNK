'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>('');
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  // Optimized scroll handler with debounce and threshold
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only update if scroll difference is significant (reduces repaints)
      if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
        return;
      }
      
      lastScrollY.current = currentScrollY;
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce the state update to prevent flickering
      scrollTimeoutRef.current = setTimeout(() => {
        const shouldBeScrolled = currentScrollY > 50;
        setIsScrolled((prev) => {
          // Only update if state actually changes
          return prev !== shouldBeScrolled ? shouldBeScrolled : prev;
        });
      }, 10); // Small delay to batch updates
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Track hash changes
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash || '');
    updateHash();
    window.addEventListener('hashchange', updateHash, { passive: true });
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menuOpen');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menuOpen');
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.classList.remove('menuOpen');
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Giới thiệu', href: '#about' },
    { label: 'Khóa học', href: '#courses' },
    { label: 'Huấn luyện viên', href: '#coaches' },
    { label: 'Thành tích', href: '#achievements' },
    { label: 'Liên hệ', href: '#contact' },
  ];

  const isItemActive = useCallback((href: string) => {
    if (currentHash === href) return true;
    if (!currentHash && href === '#home' && (pathname === '/' || pathname === '')) return true;
    return false;
  }, [currentHash, pathname]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Calculate header height for offset
      const headerHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      // Use native smooth scroll for better performance
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Update URL hash
      setTimeout(() => {
        window.history.pushState(null, '', href);
        setCurrentHash(href);
      }, 100);
    }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className={styles.headerContent}>
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Image 
              src="/images/logo.png" 
              alt="CLB Côn Nhị Khúc Hà Đông"
              width={50}
              height={50}
              className={styles.logoImage}
              priority
            />
            <div className={styles.logoText}>
              <h1>CÔN NHỊ KHÚC</h1>
              <p>Hà Đông</p>
            </div>
          </motion.div>

          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isItemActive(item.href) ? styles.active : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <motion.button
            type="button"
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Đăng ký ngay</span>
          </motion.button>

          <button
            type="button"
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}></span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}