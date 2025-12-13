// app/posts/[slug]/not-found.tsx
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Không tìm thấy bài viết</h2>
        <p className={styles.message}>
          Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/posts" className={styles.backLink}>
          ← Về trang tin tức
        </Link>
      </div>
    </div>
  );
}