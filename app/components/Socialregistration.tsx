import React, { useEffect, useRef, useState } from "react";
import styles from "./Socialregistration.module.css";

interface ContactChannel {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  link: string;
  color?: string;
}

const SocialRegistration: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [visibleChannels, setVisibleChannels] = useState<Set<number>>(
    new Set()
  );

  const contactChannels: ContactChannel[] = [
    {
      id: "zalo",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#0068FF" />
          <path
            d="M28 15H20C17.2 15 15 17.2 15 20V28C15 30.8 17.2 33 20 33H28C30.8 33 33 30.8 33 28V20C33 17.2 30.8 15 28 15Z"
            fill="white"
          />
        </svg>
      ),
      title: "Nhắn tin Zalo",
      subtitle: "Trung tâm Côn nhị khúc Hà Đông",
      link: "https://zalo.me/",
    },
    {
      id: "messenger",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="url(#messenger-gradient)" />
          <path
            d="M24 10C16.3 10 10 15.9 10 23.3C10 27.1 11.7 30.5 14.5 32.7V38L19.5 35.2C21 35.7 22.5 36 24 36C31.7 36 38 30.1 38 22.7C38 15.3 31.7 10 24 10ZM25.5 26.5L21.5 22.2L13.5 26.5L22.5 17L26.5 21.3L34.5 17L25.5 26.5Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="messenger-gradient"
              x1="24"
              y1="4"
              x2="24"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00B2FF" />
              <stop offset="1" stopColor="#006AFF" />
            </linearGradient>
          </defs>
        </svg>
      ),
      title: "Nhắn tin Messenger",
      subtitle: "Trung tâm Côn nhị khúc Hà Đông",
      link: "https://m.me/",
    },
    {
      id: "hotline",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#1a1a2e" />
          <path
            d="M16 14L18 14C18.5 14 19 14.4 19 15L19 19C19 19.6 18.5 20 18 20L16 20C15.4 20 15 19.6 15 19L15 15C15 14.4 15.4 14 16 14Z"
            fill="white"
          />
          <path
            d="M32 28L32 32C32 32.6 31.6 33 31 33L30 33C23.4 33 18 27.6 18 21L18 20C18 19.4 18.4 19 19 19L23 19C23.6 19 24 19.4 24 20L24 22C24 22.6 23.6 23 23 23L21.5 23C22.1 25.8 24.2 27.9 27 28.5L27 27C27 26.4 27.4 26 28 26L30 26C30.6 26 31 26.4 31 27L31 28L32 28Z"
            fill="white"
          />
        </svg>
      ),
      title: "Gọi Hotline",
      subtitle: "(028) 7309 6990",
      link: "tel:02873096990",
      color: "#0ea5e9",
    },
    {
      id: "register",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="32" height="32" rx="4" fill="#3B82F6" />
          <rect x="14" y="14" width="20" height="2" rx="1" fill="white" />
          <rect x="14" y="19" width="20" height="2" rx="1" fill="white" />
          <rect x="14" y="24" width="14" height="2" rx="1" fill="white" />
          <circle cx="33" cy="33" r="8" fill="#0ea5e9" />
          <path
            d="M30 33L32 35L36 31"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Đăng ký kiểm tra trình độ",
      subtitle: "Miễn Phí",
      link: "#register",
      color: "#0ea5e9",
    },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: 0.2,
    };

    // Observer for main card
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsCardVisible(true);
        } else {
          setIsCardVisible(false);
        }
      });
    }, observerOptions);

    // Observer for bottom content
    const bottomObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsBottomVisible(true);
        } else {
          setIsBottomVisible(false);
        }
      });
    }, observerOptions);

    // Observer for channel buttons
    const channelsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const channelIndex = parseInt(
          entry.target.getAttribute("data-channel-index") || "0"
        );

        if (entry.isIntersecting) {
          setVisibleChannels((prev) => new Set([...prev, channelIndex]));
        } else {
          setVisibleChannels((prev) => {
            const newSet = new Set(prev);
            newSet.delete(channelIndex);
            return newSet;
          });
        }
      });
    }, observerOptions);

    // Observe elements
    if (cardRef.current) cardObserver.observe(cardRef.current);
    if (bottomRef.current) bottomObserver.observe(bottomRef.current);
    channelsRef.current.forEach((ref) => {
      if (ref) channelsObserver.observe(ref);
    });

    return () => {
      if (cardRef.current) cardObserver.unobserve(cardRef.current);
      if (bottomRef.current) bottomObserver.unobserve(bottomRef.current);
      channelsRef.current.forEach((ref) => {
        if (ref) channelsObserver.unobserve(ref);
      });
    };
  }, []);

  const setChannelRef = (index: number) => (el: HTMLAnchorElement | null) => {
    channelsRef.current[index] = el;
  };

  return (
    <section className={styles.registrationSection}>
      <div className={styles.container}>
        {/* Main Registration Card */}
        <div
          ref={cardRef}
          className={`${styles.registrationCard} ${
            isCardVisible ? styles.registrationCardVisible : ""
          }`}
        >
          {/* Left Content */}
          <div className={styles.leftContent}>
            <h2 className={styles.title}>
              Đăng ký học cùng Côn nhị khúc Hà Đông
            </h2>
            <p className={styles.description}>
              Trung tâm võ thuật uy nhất gồm đội ngũ{" "}
              <span className={styles.highlight}>100%</span> giảng viên chuyên
              môn cao và <span className={styles.highlight}>80%</span> cựu giám
              khảo võ thuật.
            </p>

            {/* Contact Channels - 2x2 Grid */}
            <div className={styles.channelsGrid}>
              {contactChannels.map((channel, index) => (
                <a
                  key={channel.id}
                  ref={setChannelRef(index)}
                  data-channel-index={index}
                  href={channel.link}
                  className={`${styles.channelButton} ${
                    visibleChannels.has(index)
                      ? styles.channelButtonVisible
                      : ""
                  }`}
                  style={{
                    transitionDelay: `${(index % 2) * 0.1}s`,
                  }}
                >
                  <div className={styles.channelIcon}>{channel.icon}</div>
                  <div className={styles.channelInfo}>
                    <div className={styles.channelTitle}>{channel.title}</div>
                    <div
                      className={styles.channelSubtitle}
                      style={{ color: channel.color }}
                    >
                      {channel.subtitle}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Review Section */}
            <div className={styles.reviewSection}>
              <span className={styles.reviewLabel}>
                Review Côn nhị khúc Hà Đông từ học viên
              </span>
              <div className={styles.reviewRatings}>
                <div className={styles.ratingItem}>
                  <svg
                    className={styles.googleIcon}
                    viewBox="0 0 24 24"
                    fill="none"
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
                  <span className={styles.ratingScore}>4.9</span>
                  <span className={styles.ratingMax}>/5</span>
                </div>
                <div className={styles.ratingItem}>
                  <svg
                    className={styles.facebookIcon}
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className={styles.ratingScore}>4.9</span>
                  <span className={styles.ratingMax}>/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className={styles.rightImage}>
            <div className={styles.imageOverlay}></div>
            <img
              src="/images/training-session.jpg"
              alt="Học viên tập luyện côn nhị khúc"
              className={styles.image}
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80";
              }}
            />
          </div>
        </div>

        {/* Bottom Content Section */}
        <div
          ref={bottomRef}
          className={`${styles.bottomContent} ${
            isBottomVisible ? styles.bottomContentVisible : ""
          }`}
        >
          <div className={styles.divider}></div>
          <h3 className={styles.bottomTitle}>
            Trung tâm dạy Côn nhị khúc chất uy tín
          </h3>
          <div className={styles.bottomText}>
            <p>
              Côn nhị khúc Hà Đông tự hào là trung tâm võ thuật hàng đầu, mang
              đến cho học viên một môi trường học tập chuyên nghiệp, thân thiện
              và hiệu quả. Với bề dày kinh nghiệm, CLB không chỉ là trung tâm
              luyện thi võ thuật uy tín mà còn là nơi đây võ thuật đạt chuẩn
              quốc tế. CLB cam kết xây dựng trung tâm học võ thuật với chất
              lượng đào tạo vượt trội, đáp ứng nhu cầu đa dạng của học viên.
            </p>
            <p>
              Tọa lạc tại địa chỉ chi học võ thuật thuận tiện tại trung tâm Hà
              Đông, CLB tạo điều kiện tốt nhất cho việc học tập và phát triển kỹ
              năng. Với những ai đang tìm kiếm địa chỉ luyện võ thuật chất
              lượng, CLB chính là sự lựa chọn hoàn hảo, đồng hành cùng bạn trên
              hành trình chinh phục mục tiêu võ thuật mong muốn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialRegistration;
