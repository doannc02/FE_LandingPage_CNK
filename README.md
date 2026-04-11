# Landing Page Võ đường Côn Nhị Khúc Hà Đông

Landing page hiện đại, responsive được xây dựng với Next.js 14, TypeScript, và Framer Motion cho võ đường võ thuật Côn Nhị Khúc Hà Đông.

## ✨ Tính năng

- 🎨 **Thiết kế hiện đại**: Interface độc đáo với animations mượt mà
- 📱 **Responsive**: Hoạt động hoàn hảo trên mọi thiết bị
- ⚡ **Performance**: Tối ưu hóa tốc độ tải trang với Next.js 14
- 🎭 **Animations**: Framer Motion cho chuyển động và tương tác
- 🎯 **SEO-friendly**: Metadata và cấu trúc tối ưu cho SEO
- 🌐 **Multi-language ready**: Chuẩn bị sẵn cho tiếng Việt

## 🚀 Cài đặt

### Yêu cầu

- Node.js 18.17 trở lên
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository hoặc tải source code

```bash
cd nunchaku-hadong-landing
```

2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

3. Chạy development server

```bash
npm run dev
# hoặc
yarn dev
```

4. Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## 📦 Build Production

```bash
npm run build
npm run start
# hoặc
yarn build
yarn start
```

## 🎨 Cấu trúc dự án

```
nunchaku-hadong-landing/
├── app/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Courses.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── public/                  # Static files
├── package.json
└── tsconfig.json
```

## 🎯 Sections

Landing page bao gồm các sections:

1. **Header**: Navigation với sticky header và mobile menu
2. **Hero**: Banner chính với call-to-action
3. **About**: Giới thiệu về võ đường
4. **Courses**: Các khóa học với pricing cards
5. **Contact**: Form liên hệ và thông tin
6. **Footer**: Links và thông tin bổ sung

## 🎨 Customization

### Màu sắc

Chỉnh sửa CSS variables trong `app/styles/globals.css`:

```css
:root {
  --color-primary: #c41e3a; /* Đỏ chủ đạo */
  --color-secondary: #d4af37; /* Vàng gold */
  --color-dark: #0a0a0a; /* Đen background */
  /* ... */
}
```

### Nội dung

Chỉnh sửa nội dung trong các component files:

- `app/components/Hero.tsx` - Banner và stats
- `app/components/About.tsx` - Thông tin Võ đường
- `app/components/Courses.tsx` - Khóa học và giá
- `app/components/Contact.tsx` - Thông tin liên hệ

## 🚀 Deploy

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Deploy tự động

### Netlify

1. Push code lên GitHub
2. Connect repository với [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Docker

```bash
# Build image
docker build -t nunchaku-landing .

# Run container
docker run -p 3000:3000 nunchaku-landing
```

## 🔧 Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Custom CSS
- **Animation**: Framer Motion
- **Fonts**: Google Fonts (Oswald + Roboto)
- **Icons**: Emoji Unicode

## 📝 TODO / Mở rộng

- [ ] Thêm Gallery với ảnh/video
- [ ] Tích hợp backend API
- [ ] Thêm blog section
- [ ] Đa ngôn ngữ (i18n)
- [ ] CMS integration
- [ ] Google Analytics
- [ ] Chatbot tư vấn

## 📄 License

Private project - All rights reserved

## 📞 Liên hệ

Võ đường Côn Nhị Khúc Hà Đông

- Email: contact@connhikhuchadong.vn
- Phone: 0123 456 789
- Address: Quận Hà Đông, Hà Nội

---

Made with ❤️ for Võ đường Côn Nhị Khúc Hà Đông
