import type { Metadata } from 'next';
import { Oswald, Roboto } from 'next/font/google';
import './styles/globals.css';

const oswald = Oswald({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Câu lạc bộ Côn Nhị Khúc Hà Đông - Đào tạo võ thuật chuyên nghiệp',
  description: 'Câu lạc bộ Côn Nhị Khúc Hà Đông - Nơi rèn luyện tinh thần chiến binh, khơi nguồn sức mạnh nội tại. Đào tạo côn nhị khúc chuyên nghiệp từ cơ bản đến nâng cao.',
  keywords: 'côn nhị khúc, nunchaku, võ thuật, hà đông, câu lạc bộ võ thuật, martial arts',
  authors: [{ name: 'CLB Côn Nhị Khúc Hà Đông' }],
  openGraph: {
    title: 'Câu lạc bộ Côn Nhị Khúc Hà Đông',
    description: 'Đào tạo võ thuật côn nhị khúc chuyên nghiệp',
    type: 'website',
    locale: 'vi_VN',
    images: ['/images/og-image.jpg'], // replace or add a full URL if preferred
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu lạc bộ Côn Nhị Khúc Hà Đông',
    description: 'Đào tạo võ thuật côn nhị khúc chuyên nghiệp',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD organization schema
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": "Câu lạc bộ Côn Nhị Khúc Hà Đông",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com/",
    "logo": process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo_cnk.jpg` : "/images/logo_cnk.jpg",
    "sameAs": [
      // thêm các social URLs nếu có
    ],
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+84-XXXXXXXXX",
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": ["Vietnamese"]
    }]
  });

  return (
    <html lang="vi" className={`${oswald.variable} ${roboto.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* SEO extras */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com/'} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body>{children}</body>
    </html>
  );
}


