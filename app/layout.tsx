import type { Metadata } from 'next';
import './styles/globals.css';
import { QueryProvider } from './providers/QueryProvider';

export const metadata: Metadata = {
  title: {
    default: 'Câu lạc bộ Côn Nhị Khúc Hà Đông - Đào tạo võ thuật chuyên nghiệp',
    template: '%s | CLB Côn Nhị Khúc Hà Đông'
  },
  description: 'Câu lạc bộ Côn Nhị Khúc Hà Đông - Nơi rèn luyện tinh thần chiến binh, khơi nguồn sức mạnh nội tại. Đào tạo côn nhị khúc (nunchaku) chuyên nghiệp từ cơ bản đến nâng cao tại Hà Đông, Hà Nội.',
  keywords: ['côn nhị khúc', 'nunchaku', 'võ thuật', 'hà đông', 'câu lạc bộ võ thuật', 'martial arts', 'võ cổ truyền', 'tự vệ', 'luyện tập võ', 'dạy võ hà nội'],
  authors: [{ name: 'CLB Côn Nhị Khúc Hà Đông' }],
  creator: 'CLB Côn Nhị Khúc Hà Đông',
  publisher: 'CLB Côn Nhị Khúc Hà Đông',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fe-landing-page-cnk.vercel.app'),
  alternates: {
    canonical: 'https://fe-landing-page-cnk.vercel.app/',
  },
  openGraph: {
    title: 'Câu lạc bộ Côn Nhị Khúc Hà Đông - Đào tạo võ thuật chuyên nghiệp',
    description: 'Nơi rèn luyện tinh thần chiến binh, khơi nguồn sức mạnh nội tại. Đào tạo côn nhị khúc chuyên nghiệp từ cơ bản đến nâng cao tại Hà Đông, Hà Nội.',
    type: 'website',
    locale: 'vi_VN',
    url: 'https://fe-landing-page-cnk.vercel.app',
    siteName: 'CLB Côn Nhị Khúc Hà Đông',
    images: [
      {
        url: '/images/banner.png',
        width: 1200,
        height: 630,
        alt: 'Câu lạc bộ Côn Nhị Khúc Hà Đông',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu lạc bộ Côn Nhị Khúc Hà Đông - Đào tạo võ thuật chuyên nghiệp',
    description: 'Nơi rèn luyện tinh thần chiến binh, đào tạo côn nhị khúc chuyên nghiệp tại Hà Đông, Hà Nội',
    images: ['/images/banner.png'],
    creator: '@conkhuchadong',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'sports',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fe-landing-page-cnk.vercel.app";

  // Enhanced JSON-LD structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "@id": `${siteUrl}/#organization`,
    "name": "Câu lạc bộ Côn Nhị Khúc Hà Đông",
    "alternateName": "CLB Nunchaku Hà Đông",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/logo.png`,
      "width": "512",
      "height": "512"
    },
    "image": `${siteUrl}/images/banner.png`,
    "description": "Câu lạc bộ Côn Nhị Khúc Hà Đông - Nơi rèn luyện tinh thần chiến binh, đào tạo võ thuật chuyên nghiệp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hà Đông",
      "addressRegion": "Hà Nội",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "20.9707",
      "longitude": "105.7843"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": ["vi", "Vietnamese"]
    },
    "sameAs": [
      // Add social media URLs here when available
      // "https://www.facebook.com/your-page",
      // "https://www.youtube.com/your-channel",
    ],
    "sport": "Martial Arts"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "Câu lạc bộ Côn Nhị Khúc Hà Đông",
    "description": "Đào tạo võ thuật côn nhị khúc chuyên nghiệp",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "inLanguage": "vi-VN"
  };

  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
