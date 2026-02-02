import React, { useEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.css";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  avatarBg: string;
  date: string;
  rating: number;
  content: string;
  source: "Google" | "Facebook";
  sourceLink: string;
}

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState<Set<number>>(
    new Set()
  );

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Minh Tuấn",
      avatar: "M",
      avatarBg: "#e91e63",
      date: "15 Tháng 11, 2024",
      rating: 5,
      content:
        "Trước khi học côn nhị khúc ở CLB mình gần như mất gốc hoàn toàn, đặc biệt là kỹ thuật xoay côn. Mình học ở đây 2 tháng và điều mình thích nhất ở đây là không khí lớp học rất thân thiện, hiếu khách. Lớp đầu học với thầy Hùng, thầy tạo cảm giác thoải mái, hướng dẫn tận tình nên mình không còn sợ rớt côn nữa. Thầy luôn động viên và chỉnh sửa từng động tác chi tiết.",
      source: "Google",
      sourceLink: "#",
    },
    {
      id: 2,
      name: "Thu Hà",
      avatar: "T",
      avatarBg: "#9c27b0",
      date: "28 Tháng 10, 2024",
      rating: 5,
      content:
        "Con mình học côn nhị khúc tại CLB và mình rất hài lòng. Con tiến bộ rõ rệt, đặc biệt là sự tự tin khi biểu diễn trước đám đông. Giáo viên tận tâm, chăm bài kỹ, môi trường học tích cực và không áp lực. Là phụ huynh, mình cảm thấy yên tâm khi cho con học tại đây. Đội ngũ HLV rất chuyên nghiệp và quan tâm đến từng học viên.",
      source: "Google",
      sourceLink: "#",
    },
    {
      id: 3,
      name: "Hoàng Nam",
      avatar: "H",
      avatarBg: "#673ab7",
      date: "10 Tháng 11, 2024",
      rating: 5,
      content:
        "Mình đã hoàn thành khóa IELTS Level 2 ở CLB Côn nhị khúc. Mình trước giờ chỉ tự học ở nhà cho đến khi tìm được CLB, mình thấy rất biết ơn vì đã được là 1 phần của lớp thầy Linh. Từ học đội hình sẽ hơi lost và khó khăn vì không có người hướng dẫn, đáp ý và sửa lỗi sai cho mình nên khi được học ở đây mình tiến bộ rất nhiều.",
      source: "Facebook",
      sourceLink: "#",
    },
    {
      id: 4,
      name: "Phương Anh",
      avatar: "P",
      avatarBg: "#00bcd4",
      date: "05 Tháng 11, 2024",
      rating: 5,
      content:
        "Chắc có nhiều bạn ở đây là sinh viên giống mình, muốn học tiếng võ thuật để lôi bóng ra trường. Rất biết ơn vì tìm được CLB Level 2 ở Hà Đông. Mình thi khum cần nhiều, chỉ cần 6.5 là đủ rồi, sau 3 tháng mình cũng đạt được level mình mong muốn. Cảm ơn thầy Sơn và các bạn cùng lớp nhiều. Thầy rất tận tâm và kiên nhẫn trong việc hướng dẫn.",
      source: "Facebook",
      sourceLink: "#",
    },
    {
      id: 5,
      name: "Đức Anh",
      avatar: "Đ",
      avatarBg: "#3f51b5",
      date: "18 Tháng 10, 2024",
      rating: 5,
      content:
        "Đây là khóa học đầu tiên khóa học côn nhị khúc thì mình cảm ơn thầy Minh vì đã giúp mình nâng cao kỹ năng biểu diễn và học côn đúng cách. Từ trước đến nay mình luôn ở bận khó thấp những đợt này nhờ trung tâm và thầy đã giúp đạt aim. Cảm ơn thầy và trung tâm rất nhiều. Môi trường luyện tập chuyên nghiệp, trang thiết bị đầy đủ.",
      source: "Google",
      sourceLink: "#",
    },
    {
      id: 6,
      name: "Mai Linh",
      avatar: "M",
      avatarBg: "#ff5722",
      date: "25 Tháng 10, 2024",
      rating: 5,
      content:
        "Mình học khóa Level 2 ở CLB Côn nhị khúc Hà Đông mấy tháng nay thấy tiến bộ rõ rệt, từ 6.0 lên 7.0 khá nhanh. Thầy có cô người từng chấm thi thật cho British Council và IDP, nên sửa lỗi chuẩn, hiệu ngay vấn đề. Giáo trình ngắn gọn, tập trung đúng phần hay ra thi, không lan man. Mình thích cách học ở đây vì thực chiến và hiệu quả.",
      source: "Google",
      sourceLink: "#",
    },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: 0.2,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const testimonialId = parseInt(
          entry.target.getAttribute("data-testimonial-id") || "0"
        );

        if (entry.isIntersecting) {
          setVisibleTestimonials((prev) => new Set([...prev, testimonialId]));
        } else {
          setVisibleTestimonials((prev) => {
            const newSet = new Set(prev);
            newSet.delete(testimonialId);
            return newSet;
          });
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    testimonialsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      testimonialsRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const setTestimonialRef = (index: number) => (el: HTMLDivElement | null) => {
    testimonialsRef.current[index] = el;
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`${styles.star} ${
              index < rating ? styles.starFilled : ""
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderSourceIcon = (source: "Google" | "Facebook") => {
    if (source === "Google") {
      return (
        <svg
          className={styles.sourceIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className={styles.sourceIcon}
          viewBox="0 0 24 24"
          fill="#1877F2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    }
  };

  return (
    <section className={styles.testimonialsSection} ref={sectionRef}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerDivider}></div>
          <h2 className={styles.sectionTitle}>
            Học viên nói gì về Côn nhị khúc Hà Đông
          </h2>
          <p className={styles.sectionDescription}>
            Lắng nghe những chia sẻ về trải nghiệm học tập tại CLB của các học
            viên.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={setTestimonialRef(index)}
              data-testimonial-id={testimonial.id}
              className={`${styles.testimonialCard} ${
                visibleTestimonials.has(testimonial.id)
                  ? styles.testimonialCardVisible
                  : ""
              }`}
              style={{
                transitionDelay: `${(index % 3) * 0.1}s`,
              }}
            >
              {/* Quote Icon */}
              <div className={styles.quoteIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>

              {/* Header */}
              <div className={styles.testimonialHeader}>
                <div className={styles.avatarSection}>
                  <div
                    className={styles.avatar}
                    style={{ backgroundColor: testimonial.avatarBg }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div className={styles.nameSection}>
                    <h3 className={styles.name}>{testimonial.name}</h3>
                    <div className={styles.dateRating}>
                      <span className={styles.date}>{testimonial.date}</span>
                      <span className={styles.separator}>|</span>
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className={styles.content}>{testimonial.content}</p>

              {/* Footer */}
              <div className={styles.footer}>
                <div className={styles.source}>
                  {renderSourceIcon(testimonial.source)}
                  <span className={styles.sourceName}>
                    {testimonial.source}
                  </span>
                </div>
                <a href={testimonial.sourceLink} className={styles.detailLink}>
                  Xem chi tiết
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={styles.ctaSection}>
          <a href="#review" className={styles.ctaButton}>
            <span>Đánh giá từ học viên</span>
          </a>
        </div>
      </div>

      {/* Background Decorations */}
      <div className={styles.bgDecoration1}></div>
      <div className={styles.bgDecoration2}></div>
    </section>
  );
};

export default Testimonials;
