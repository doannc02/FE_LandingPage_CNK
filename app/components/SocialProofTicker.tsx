'use client';

import { Users, Star, MapPin, Award, Clock } from 'lucide-react';

const ITEMS = [
  { Icon: Users,  label: '500+ Học viên' },
  { Icon: Clock,  label: '13+ Năm kinh nghiệm' },
  { Icon: MapPin, label: '5 Cơ sở tập luyện' },
  { Icon: Star,   label: '4.9★ Google Rating' },
  { Icon: Award,  label: '100% HLV chuyên môn' },
  { Icon: Users,  label: '80% Cựu VĐV Quốc gia' },
];

export default function SocialProofTicker() {
  return (
    <div
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(220,38,38,0.2)',
        borderBottom: '1px solid rgba(220,38,38,0.2)',
        overflow: 'hidden',
        padding: '0.75rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          animation: 'ticker-scroll 28s linear infinite',
          width: 'max-content',
        }}
      >
        {[...ITEMS, ...ITEMS].map(({ Icon, label }, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 2.5rem',
              whiteSpace: 'nowrap',
              color: i % 2 === 0 ? '#f3f4f6' : '#dc2626',
              fontWeight: 600,
              fontSize: '0.8125rem',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.01em',
            }}
          >
            <Icon size={14} color="#dc2626" />
            <span>{label}</span>
            <span style={{ color: 'rgba(220,38,38,0.4)', marginLeft: '1.5rem' }}>◆</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ticker-scroll"] { animation: none; }
        }
      `}</style>
    </div>
  );
}
