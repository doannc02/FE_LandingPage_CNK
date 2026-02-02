import React, { useEffect, useRef, useState } from "react";
import styles from "./Benefits.module.css";

interface Benefit {
  id: number;
  title: string;
  highlight: string;
  description: string;
}

const Benefits: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleBenefits, setVisibleBenefits] = useState<Set<number>>(
    new Set()
  );

  const benefits: Benefit[] = [
    {
      id: 1,
      title: "Lộ trình cam kết",
      highlight: "đạt mục tiêu",
      description:
        'Với nhiều năm kinh nghiệm huấn luyện, chúng tôi cam kết học viên được học lại miễn phí nếu chưa nắm vững kỹ thuật cơ bản sau khóa học. Không chỉ dạy "chiêu thức", chúng tôi đào tạo năng lực thực thụ: vững kỹ thuật, đúng bộ pháp, ổn định tâm lý – giúp học viên tự tin biểu diễn hoặc thực chiến với sự kiểm soát cao nhất.',
    },
    {
      id: 2,
      title: "Phương pháp",
      highlight: "Total Immersion",
      description:
        "CLB tạo môi trường tập luyện cộng đồng 100% tinh thần võ đạo, giúp học viên tiến bộ nhanh hơn 40% so với việc tự mày mò qua video. Chúng tôi không chỉ hướng đến việc thuộc bài quyền, mà còn đào tạo để học viên ứng dụng sự linh hoạt, phản xạ vào sức khỏe và kỷ luật trong cuộc sống.",
    },
    {
      id: 3,
      title: "Đội ngũ Giảng viên",
      highlight: "chuyên môn cao",
      description:
        "Các HLV tại CLB đều là những người có thâm niên, có bề dày thành tích tại các giải võ thuật và kinh nghiệm giảng dạy thực tế nhiều năm. Chương trình đào tạo được cá nhân hóa theo trình độ từng người, đảm bảo hỗ trợ đúng trọng tâm, đặc biệt nâng cao khả năng cảm nhận côn và sự linh hoạt của cổ tay.",
    },
    {
      id: 4,
      title: "Ứng dụng",
      highlight: "công nghệ",
      description:
        "CLB tiên phong ứng dụng các video bài giảng chất lượng cao giúp học viên tự luyện tập tại nhà. Hệ thống theo dõi quá trình tập luyện và đưa ra lời khuyên chỉnh sửa tư thế chi tiết theo chuẩn kỹ thuật biểu diễn quốc tế. Sử dụng nền tảng nhóm kín để hỗ trợ giải đáp thắc mắc mọi lúc, mọi nơi.",
    },
    {
      id: 5,
      title: "Mô hình giảng dạy",
      highlight: "kết hợp, toàn diện",
      description:
        "Kết hợp giữa đội ngũ HLV kỳ cựu giúp xây dựng nền tảng bộ pháp vững chắc cùng các bài tập hiện đại giúp nâng cao cảm giác côn. Đồng thời, CLB triển khai các hoạt động giao lưu, offline và biểu diễn thực tế xuyên suốt lộ trình để học viên phát triển toàn diện cả kỹ năng và bản lĩnh.",
    },
    {
      id: 6,
      title: "Giáo trình",
      highlight: "thích ứng",
      description:
        "Giáo trình được biên soạn dựa trên kinh nghiệm thực tế từ các võ sư lâu năm, bám sát các tiêu chuẩn biểu diễn nghệ thuật. Nội dung giảng dạy luôn được cập nhật để phản ánh những xu hướng mới nhất của võ thuật đương đại và phù hợp với thể trạng, thế mạnh riêng của học viên Việt Nam.",
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
        const benefitId = parseInt(
          entry.target.getAttribute("data-benefit-id") || "0"
        );

        if (entry.isIntersecting) {
          // Add to visible set when entering viewport
          setVisibleBenefits((prev) => new Set([...prev, benefitId]));
        } else {
          // Remove from visible set when leaving viewport
          setVisibleBenefits((prev) => {
            const newSet = new Set(prev);
            newSet.delete(benefitId);
            return newSet;
          });
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    benefitsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      benefitsRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const setBenefitRef = (index: number) => (el: HTMLDivElement | null) => {
    benefitsRef.current[index] = el;
  };

  return (
    <section className={styles.benefitsSection} ref={sectionRef}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Đặc quyền của học viên{" "}
            <span className={styles.highlight}>Côn nhị khúc Hà Đông</span>
          </h2>
        </div>

        {/* Benefits Grid - 2 Column Layout */}
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              ref={setBenefitRef(index)}
              data-benefit-id={benefit.id}
              className={`${styles.benefitCard} ${
                visibleBenefits.has(benefit.id) ? styles.benefitCardVisible : ""
              }`}
              style={{
                transitionDelay: `${(index % 2) * 0.1}s`,
              }}
            >
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>
                  {benefit.title}{" "}
                  <span className={styles.benefitHighlight}>
                    {benefit.highlight}
                  </span>
                </h3>
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <a href="#register" className={styles.ctaButton}>
            <span>Đăng ký tư vấn</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>

      {/* Background Decorations */}
      <div className={styles.bgDecoration1}></div>
      <div className={styles.bgDecoration2}></div>
    </section>
  );
};

export default Benefits;
