'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import Image from 'next/image'; // Import Image component
import { motion } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>('');
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track the hash portion of the URL so we can highlight active section links (fixes bug where usePathname never equals '#hash' values)
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash || '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const navItems = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Giới thiệu', href: '#about' },
    { label: 'Khóa học', href: '#courses' },
    { label: 'Huấn luyện viên', href: '#coaches' },
    { label: 'Thành tích', href: '#achievements' },
    { label: 'Liên hệ', href: '#contact' },
  ];

  const isItemActive = (href: string) => {
    // If the currentHash matches the href, it's active
    if (currentHash === href) return true;
    // If there's no hash (top of page) treat '#home' as active on the homepage
    if (!currentHash && (href === '#home') && (pathname === '/' || pathname === '')) return true;
    return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // Get the target section ID from href (remove the #)
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Smooth scroll to the element
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update the URL hash after scrolling
      setTimeout(() => {
        window.history.pushState(null, '', href);
        setCurrentHash(href);
      }, 100);
    }
  };

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
              src="/images/logo_cnk.jpg" 
              alt="CLB Côn Nhị Khúc Hà Đông"
              width={50}
              height={50}
              className={styles.logoImage}
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
                className={`${styles.navLink} ${isItemActive(item.href) ? styles.active : ''}`} // Highlight active menu using hash-aware check
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
