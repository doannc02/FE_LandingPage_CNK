# Hướng dẫn SEO cho Landing Page Côn Nhị Khúc Hà Đông

## 📋 Tổng quan

Website đã được tối ưu SEO toàn diện cho Vercel deployment với các tính năng:

- ✅ Meta tags đầy đủ (Title, Description, Keywords)
- ✅ Open Graph tags cho Facebook/Social Media
- ✅ Twitter Cards
- ✅ JSON-LD Structured Data (Schema.org)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ PWA Manifest
- ✅ Security Headers
- ✅ Performance Optimization
- ✅ Vietnamese Language Support

## 🚀 Deploy lên Vercel

### Bước 1: Cấu hình Environment Variables

Trên Vercel Dashboard, thêm các biến môi trường:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
```

### Bước 2: Deploy

```bash
# Install dependencies
npm install

# Build project
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔧 Cấu hình cần thiết

### 1. Cập nhật Domain trong các file

Sau khi deploy, cập nhật domain thật của bạn trong:

- `app/layout.tsx`: metadataBase URL
- `public/sitemap.xml`: Thay đổi URL
- `public/robots.txt`: Thay đổi Sitemap URL
- `.env.local`: Tạo file và thêm NEXT_PUBLIC_SITE_URL

### 2. Thêm Favicon và Icons

Thêm các file sau vào thư mục `public/`:

- `favicon.ico` (16x16, 32x32 pixels)
- `icon.svg` (SVG format)
- `apple-touch-icon.png` (180x180 pixels)

Bạn có thể dùng tool online như [Favicon Generator](https://realfavicongenerator.net/)

### 3. Tạo OG Image

Tạo ảnh Open Graph để hiển thị khi share lên social media:

- Kích thước khuyến nghị: 1200x630 pixels
- Đặt tại: `public/images/og-image.jpg` hoặc sử dụng `banner.png` hiện có
- Format: JPG, PNG, hoặc WebP

### 4. Google Search Console

1. Truy cập [Google Search Console](https://search.google.com/search-console)
2. Thêm property với domain của bạn
3. Verify ownership bằng meta tag verification code
4. Cập nhật code vào `app/layout.tsx` line 68
5. Submit sitemap: `https://your-domain.com/sitemap.xml`

### 5. Social Media Links

Cập nhật social media URLs trong `app/layout.tsx`:

```typescript
"sameAs": [
  "https://www.facebook.com/your-page",
  "https://www.youtube.com/your-channel",
  "https://www.instagram.com/your-profile",
],
```

### 6. Contact Information

Cập nhật thông tin liên hệ trong JSON-LD schema (`app/layout.tsx`):

```typescript
"contactPoint": {
  "@type": "ContactPoint",
  "telephone": "+84-XXX-XXX-XXX", // Số điện thoại thật
  "contactType": "customer service",
  "areaServed": "VN",
  "availableLanguage": ["vi", "Vietnamese"]
}
```

## 📊 SEO Best Practices đã áp dụng

### 1. Meta Tags
- Title tags tối ưu (50-60 ký tự)
- Meta description hấp dẫn (150-160 ký tự)
- Keywords phù hợp với nội dung
- Viewport và charset đúng chuẩn

### 2. Structured Data (JSON-LD)
- SportsClub schema cho câu lạc bộ
- WebSite schema cho website
- Địa chỉ và tọa độ địa lý
- Contact information

### 3. Open Graph & Twitter Cards
- Tối ưu cho Facebook, LinkedIn
- Twitter card với ảnh lớn
- Title và description tùy chỉnh

### 4. Technical SEO
- Sitemap.xml cho crawler
- Robots.txt cho search engines
- Canonical URLs
- Security headers (X-Frame-Options, CSP, etc.)
- Performance optimization (compression, caching)

### 5. Performance
- Image optimization (WebP, AVIF)
- Font optimization với display: swap
- Compression enabled
- Cache headers cho static assets

## 🔍 Kiểm tra SEO

### Online Tools

1. **Google Search Console**: Monitor search performance
2. **Google PageSpeed Insights**: Check performance score
3. **Schema Markup Validator**: Validate structured data
   - https://validator.schema.org/
   - https://search.google.com/test/rich-results
4. **Facebook Sharing Debugger**: Test OG tags
   - https://developers.facebook.com/tools/debug/
5. **Twitter Card Validator**: Test Twitter cards
   - https://cards-dev.twitter.com/validator

### Chrome DevTools

```bash
# Lighthouse audit
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Run audit for SEO, Performance, Best Practices
```

## 📈 Theo dõi và Cải thiện

### 1. Google Analytics (Optional)

```bash
# Thêm vào .env.local
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 2. Monitor Search Rankings

- Theo dõi từ khóa: "côn nhị khúc hà đông", "nunchaku hà nội"
- Kiểm tra backlinks
- Theo dõi traffic từ search engines

### 3. Content Updates

- Cập nhật sitemap khi có nội dung mới
- Refresh lastmod date trong sitemap.xml
- Submit sitemap lại lên Google Search Console

## 🎯 Từ khóa đã tối ưu

- côn nhị khúc
- nunchaku
- võ thuật hà đông
- câu lạc bộ võ thuật
- martial arts
- võ cổ truyền
- tự vệ
- dạy võ hà nội

## ⚡ Vercel-specific Optimizations

File `vercel.json` đã được cấu hình với:

- Security headers
- Cache control cho static assets
- Compression
- Performance headers

## 📱 Mobile Optimization

- Responsive design
- PWA support với manifest.json
- Touch-friendly
- Fast loading on mobile networks

## 🔐 Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: restrictive

## 📞 Hỗ trợ

Nếu cần hỗ trợ thêm về SEO:

1. Kiểm tra Google Search Console để xem lỗi crawling
2. Validate structured data tại schema.org
3. Test page speed và mobile-friendliness
4. Monitor Core Web Vitals

---

**Lưu ý**: Sau khi deploy, hãy đợi 24-48 giờ để Google index website. Submit sitemap qua Google Search Console để tăng tốc quá trình này.
