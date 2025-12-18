// app/components/Postdetail.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../lib/api/posts';
import { useLikePost } from '../lib/hooks/usePosts';
import styles from './PostDetail.module.css';
import ShareButtons from './ShareButtons';
import AuthorBio from './AuthorBio';
import PostComments from './PostComments';

interface PostDetailProps {
  post: Post & {
    content?: string;
    tags?: Array<{ id: string; name: string; slug: string }>;
    authorBio?: string;
    authorAvatar?: string;
  };
  relatedPosts: Post[];
}

// Default fallback images
const DEFAULT_FEATURED_IMAGE = '/images/banner.png';
const DEFAULT_THUMBNAIL = '/images/logo.png';
const DEFAULT_AVATAR = '/images/avatar-default.png';

const formatVietnameseDate = (dateString: string | null) => {
  if (!dateString) return 'Chưa xuất bản';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const ReadingTime = ({ content }: { content: string }) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return (
    <div className={styles.readingTime}>
      <svg className={styles.timeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{readingTime} phút đọc</span>
    </div>
  );
};

const TableOfContents = ({ content }: { content: string }) => {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingsArray = Array.from(doc.querySelectorAll('h2, h3, h4'))
      .map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }));
    
    setHeadings(headingsArray);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <motion.div 
      className={styles.tableOfContents}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className={styles.tocHeader}>
        <svg className={styles.tocIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <h3>Mục lục</h3>
      </div>
      <nav className={styles.tocContent}>
        <ul>
          {headings.map((heading) => (
            <motion.li 
              key={heading.id} 
              className={`${styles.tocItem} ${styles[`level-${heading.level}`]}`}
              whileHover={{ x: 5 }}
            >
              <a href={`#${heading.id}`} className={styles.tocLink}>
                {heading.text}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

// Reading Progress Bar Component
const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className={styles.progressBar}
      style={{ scaleX }}
    />
  );
};

export default function PostDetail({ post, relatedPosts }: PostDetailProps) {
  const [showToc, setShowToc] = useState(false);
  const [currentHeading, setCurrentHeading] = useState('');
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const likePostMutation = useLikePost();

  // Scroll listener for TOC highlighting
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3, h4');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 300) {
          current = heading.id;
        }
      });
      
      setCurrentHeading(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = async () => {
    try {
      const newLikeCount = await likePostMutation.mutateAsync(post.id);
      setCurrentPost(prev => ({
        ...prev,
        likeCount: newLikeCount
      }));
      setIsLiked(true);
      
      // Animation feedback
      setTimeout(() => setIsLiked(false), 1000);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('Đăng ký thành công!');
        form.reset();
      } else {
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPost.title,
          text: currentPost.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  return (
    <>
      <ReadingProgressBar />
      
      <article className={styles.postContainer}>
        {/* Breadcrumb */}
        <motion.nav 
          className={styles.breadcrumb} 
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ol>
            <li>
              <Link href="/" className={styles.breadcrumbLink}>
                <svg className={styles.homeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Trang chủ
              </Link>
            </li>
            <li>
              <svg className={styles.breadcrumbSeparator} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/posts" className={styles.breadcrumbLink}>
                Tin tức
              </Link>
            </li>
            <li>
              <svg className={styles.breadcrumbSeparator} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {currentPost.title}
              </span>
            </li>
          </ol>
        </motion.nav>

        {/* Header */}
        <motion.header 
          className={styles.postHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.postMeta}>
            <Link 
              href={`/categories/${currentPost.categoryName?.toLowerCase()}`} 
              className={styles.categoryBadge}
            >
              {currentPost.categoryName || 'Tin tức'}
            </Link>
            
            <div className={styles.metaInfo}>
              <span className={styles.date}>
                <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatVietnameseDate(currentPost.publishedAt || currentPost.createdAt)}
              </span>
              
              <div className={styles.stats}>
                <span className={styles.stat}>
                  <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {abbreviateNumber(currentPost.viewCount)}
                </span>
                <motion.button 
                  onClick={handleLike}
                  disabled={likePostMutation.isPending}
                  className={`${styles.statButton} ${isLiked ? styles.liked : ''}`}
                  aria-label="Thích bài viết"
                  whileTap={{ scale: 0.9 }}
                  animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                >
                  <span className={styles.stat}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {abbreviateNumber(currentPost.likeCount)}
                  </span>
                </motion.button>
                <span className={styles.stat}>
                  <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {abbreviateNumber(currentPost.commentCount)}
                </span>
              </div>
            </div>
          </div>

          <h1 className={styles.postTitle}>{currentPost.title}</h1>
          
          {currentPost.excerpt && (
            <p className={styles.postExcerpt}>{currentPost.excerpt}</p>
          )}

          <div className={styles.authorSection}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                <img
                  src={currentPost.authorAvatar || DEFAULT_AVATAR}
                  alt={currentPost.authorName || 'Tác giả'}
                  width={56}
                  height={56}
                  className={styles.avatarImage}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div>
                <div className={styles.authorName}>{currentPost.authorName || 'Tác giả CLB'}</div>
                <div className={styles.authorRole}>Tác giả bài viết</div>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              {currentPost.content && <ReadingTime content={currentPost.content} />}
              <button 
                className={styles.tocToggle}
                onClick={() => setShowToc(!showToc)}
                aria-label={showToc ? 'Ẩn mục lục' : 'Hiển thị mục lục'}
              >
                <svg className={styles.tocToggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Mục lục
              </button>
            </div>
          </div>
        </motion.header>

        {/* Featured Image with Fallback */}
        <motion.div 
          className={styles.featuredImageWrapper}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.imageContainer}>
            <Image
              src={currentPost.featuredImageUrl || DEFAULT_FEATURED_IMAGE}
              alt={currentPost.title}
              fill
              className={styles.featuredImage}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_FEATURED_IMAGE;
              }}
            />
            {!currentPost.featuredImageUrl && (
              <div className={styles.imagePlaceholder}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Ảnh minh họa mặc định</span>
              </div>
            )}
          </div>
          <div className={styles.imageCaption}>
            <svg className={styles.captionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{currentPost.featuredImageUrl ? 'Hình ảnh minh họa' : 'CLB Côn Nhị Khúc Hà Đông'}</span>
          </div>
        </motion.div>

        {/* Content Area with Sidebar */}
        <div className={styles.contentLayout}>
          {/* Main Content */}
          <motion.div 
            className={styles.mainContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentPost.content ? (
              <div 
                className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />
            ) : (
              <div className={styles.noContent}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>Nội dung đang được cập nhật</h3>
                <p>Vui lòng quay lại sau để xem nội dung chi tiết của bài viết này.</p>
              </div>
            )}

            {/* Tags */}
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className={styles.tagsSection}>
                <h3 className={styles.tagsTitle}>
                  <svg className={styles.tagIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Thẻ bài viết
                </h3>
                <div className={styles.tagsList}>
                  {currentPost.tags.map((tag:any) => (
                    <Link 
                      key={tag.id} 
                      href={`/tags/${tag.slug}`}
                      className={styles.tag}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className={styles.shareSection}>
              <h3 className={styles.shareTitle}>Chia sẻ bài viết</h3>
              <ShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={currentPost.title}
                description={currentPost.excerpt || ''}
              />
            </div>

            {/* Author Bio */}
            {currentPost.authorBio && (
              <AuthorBio 
                authorName={currentPost.authorName || 'Tác giả'}
                authorAvatar={currentPost.authorAvatar}
                bio={currentPost.authorBio}
              />
            )}

            {/* Comments */}
            <PostComments postId={currentPost.id} />
          </motion.div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {currentPost.content && (
              <TableOfContents content={currentPost.content} />
            )}

            {/* Related Posts with Fallback Images */}
            {relatedPosts.length > 0 && (
              <motion.div 
                className={styles.relatedPosts}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className={styles.relatedTitle}>
                  <svg className={styles.relatedIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Bài viết liên quan
                </h3>
                <div className={styles.relatedList}>
                  {relatedPosts.map((relatedPost) => (
                    <motion.article 
                      key={relatedPost.id}
                      className={styles.relatedCard}
                      whileHover={{ x: 5 }}
                    >
                      <Link href={`/posts/${relatedPost.slug}`} className={styles.relatedLink}>
                        <div className={styles.relatedImage}>
                          <img
                            src={relatedPost.featuredImageUrl || relatedPost.thumbnailUrl || DEFAULT_THUMBNAIL}
                            alt={relatedPost.title}
                            width={80}
                            height={60}
                            className={styles.relatedImg}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_THUMBNAIL;
                            }}
                          />
                        </div>
                        <div className={styles.relatedContent}>
                          <h4 className={styles.relatedPostTitle}>{relatedPost.title}</h4>
                          <span className={styles.relatedDate}>
                            {formatVietnameseDate(relatedPost.publishedAt || relatedPost.createdAt)}
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Newsletter Signup */}
            <motion.div 
              className={styles.newsletterCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className={styles.newsletterIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className={styles.newsletterTitle}>Nhận tin mới</h4>
              <p className={styles.newsletterDescription}>
                Đăng ký để nhận bài viết mới nhất từ CLB
              </p>
              <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
                  className={styles.newsletterInput}
                  required
                />
                <button type="submit" className={styles.newsletterButton}>
                  Đăng ký
                </button>
              </form>
            </motion.div>
          </aside>
        </div>

        {/* Mobile TOC */}
        {currentPost.content && showToc && (
          <motion.div 
            className={styles.mobileToc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.mobileTocHeader}>
              <h3>Mục lục</h3>
              <button 
                className={styles.closeToc}
                onClick={() => setShowToc(false)}
                aria-label="Đóng mục lục"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TableOfContents content={currentPost.content} />
          </motion.div>
        )}

        {/* Floating Action Buttons */}
        <div className={styles.floatingActions}>
          <motion.button 
            className={styles.floatingButton}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Lên đầu trang"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
          
          <motion.button 
            className={`${styles.floatingButton} ${styles.shareButton}`}
            onClick={handleShare}
            aria-label="Chia sẻ bài viết"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </motion.button>
        </div>

        {/* Share Toast Notification */}
        {showShareToast && (
          <motion.div 
            className={styles.shareToast}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Đã sao chép link!</span>
          </motion.div>
        )}
      </article>
    </>
  );
}