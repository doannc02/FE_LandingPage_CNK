/**
 * E2E smoke tests for FE_LandingPage_CNK
 * Run: node e2e-test.mjs
 * Requires: dev/prod server running on http://localhost:3001
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3007';
let passed = 0;
let failed = 0;

function log(ok, label, detail = '') {
  const mark = ok ? '✅' : '❌';
  console.log(`  ${mark} ${label}${detail ? ` — ${detail}` : ''}`);
  if (ok) passed++; else failed++;
}

async function dismissPopup(page) {
  try {
    // Try multiple close button selectors
    for (const sel of ['button[aria-label*="close" i]', 'button:has-text("×")', '[class*="close"]', 'button:has-text("Đóng")']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click();
        await page.waitForTimeout(300);
        break;
      }
    }
  } catch {}
}

async function testHomepage(browser) {
  console.log('\n📋 HOMEPAGE TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);

  // 1. Page title
  const title = await page.title();
  log(title.length > 0, 'Page has title', title.substring(0, 60));

  // 2. Header visible
  const headerVisible = await page.locator('header, nav').first().isVisible();
  log(headerVisible, 'Header/nav is visible');

  // 3. Hero section
  const heroText = await page.locator('h1').first().textContent().catch(() => '');
  log(heroText.length > 5, 'Hero h1 visible', heroText.substring(0, 50));

  // 4. About section — all 4 feature cards visible
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(1200);
  const featureCards = await page.locator('[class*="featureCard"]').count();
  log(featureCards === 4, `About section: 4 feature cards visible`, `found ${featureCards}`);

  // 5. BranchPreview — fallback branches visible
  await page.evaluate(() => window.scrollTo(0, 2800));
  await page.waitForTimeout(1000);
  const branchCards = await page.locator('[class*="card"]').count();
  log(branchCards >= 3, `BranchPreview: ≥3 branch cards`, `found ${branchCards}`);

  // 6. SocialRegistration — channel buttons with icons visible
  const totalH = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h * 0.72), totalH);
  await page.waitForTimeout(2000);
  await dismissPopup(page);
  await page.waitForTimeout(500);

  const channelButtons = await page.locator('[class*="channelButton"]').count();
  log(channelButtons === 4, `SocialRegistration: 4 channel buttons visible`, `found ${channelButtons}`);

  // Each channel button should contain an SVG icon
  const channelIcons = await page.locator('[class*="channelButton"] svg').count();
  log(channelIcons >= 4, `Channel buttons have SVG icons`, `found ${channelIcons}`);

  // Hotline number should be 0868.699.860 (not placeholder)
  const hotlineText = await page.locator('[class*="channelButton"]').nth(2).textContent().catch(() => '');
  log(hotlineText.includes('0868'), 'Hotline shows real number (0868)', hotlineText.trim().substring(0, 40));

  // 7. Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await dismissPopup(page);
  await page.waitForTimeout(400);

  const footerPhone = await page.locator('footer').textContent().catch(() => '');
  log(footerPhone.includes('0868.699.860'), 'Footer: real phone number visible');
  log(!footerPhone.includes('0123 456 789'), 'Footer: placeholder phone GONE');
  log(!footerPhone.includes('ch지'), 'Footer: broken character fixed');

  await page.close();
}

async function testNavigation(browser) {
  console.log('\n📋 NAVIGATION TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);

  // 1. Click "Giới thiệu" nav item → scrolls to about section
  const aboutLink = page.locator('a:has-text("Giới thiệu")').first();
  if (await aboutLink.isVisible({ timeout: 1000 })) {
    await aboutLink.click();
    await page.waitForTimeout(800);
    const url = page.url();
    log(url.includes('about') || url.includes('#'), 'Nav: "Giới thiệu" click navigates', url);
  } else {
    log(false, 'Nav: "Giới thiệu" link not found');
  }

  // 2. "Đăng ký ngay" button in header
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1500);
  const registerBtn = page.locator('a:has-text("Đăng ký ngay"), button:has-text("Đăng ký ngay")').first();
  const registerBtnVisible = await registerBtn.isVisible({ timeout: 2000 }).catch(() => false);
  log(registerBtnVisible, 'Header: "Đăng ký ngay" CTA visible');

  await page.close();
}

async function testPostsPage(browser) {
  console.log('\n📋 POSTS PAGE TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/posts`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(6000); // Wait for API call + retry (5s timeout + 1 retry)

  const pageText = await page.locator('main').textContent().catch(() => '');
  const hasError = pageText.includes('Không thể tải') || pageText.includes('Thử lại');
  const hasEmpty = pageText.includes('Không có bài viết');
  const hasPosts = await page.locator('[class*="PostCard"], a[href^="/posts/"]').count() > 0;
  const hasSearchInput = await page.locator('input[placeholder*="Tìm"]').count() > 0;

  log(hasSearchInput, 'Posts page: search bar input visible');
  log(hasError || hasEmpty || hasPosts, 'Posts page: shows error state, empty state, or posts list');

  if (hasError) log(true, 'Posts page: API down → proper error shown');
  if (hasPosts) log(true, 'Posts page: posts loaded from API');

  await page.close();
}

async function testNewsFallback(browser) {
  console.log('\n📋 NEWS SECTION FALLBACK TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);

  // Scroll to news section
  const h = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h * 0.78), h);
  await page.waitForTimeout(2000);
  try { await page.locator('[class*="close"]').first().click({ timeout: 600 }); } catch {}
  await page.waitForTimeout(400);

  // News section should show content (fallback articles when API down)
  const newsText = await page.locator('#news').textContent().catch(() => '');
  const hasTinTuc = newsText.includes('Tin Tức') || newsText.includes('Tin tức') || newsText.includes('Sự Kiện');
  log(hasTinTuc, 'News: section header visible');

  const hasArticles = await page.locator('#news article, #news [class*="article"]').count() > 0;
  const hasFallbackText = newsText.includes('Côn nhị khúc') || newsText.includes('võ thuật') || newsText.includes('Chi tiết');
  log(hasArticles || hasFallbackText, 'News: articles visible (fallback or real)');
  log(!newsText.includes('Network Error'), 'News: raw Network Error NOT shown');
  log(!newsText.includes('Lỗi tải tin tức'), 'News: error state NOT shown (fallback used instead)');

  await page.close();
}

async function testAnnouncementBar(browser) {
  console.log('\n📋 ANNOUNCEMENT BAR TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  // Clear localStorage to show announcement bar
  await page.addInitScript(() => localStorage.clear());
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);

  const barText = await page.locator('body').textContent().catch(() => '');
  const hasBar = barText.includes('Khai giảng') || barText.includes('ưu đãi');
  log(hasBar, 'Announcement bar: promo text visible');

  // Dismiss and verify it hides
  const dismissBtn = page.locator('button[aria-label="Đóng thông báo"]').first();
  const btnVisible = await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false);
  if (btnVisible) {
    await dismissBtn.click({ force: true });
    await page.waitForTimeout(300);
    const afterText = await page.locator('body').textContent().catch(() => '');
    const barGone = !afterText.includes('Còn 10 chỗ trống');
    log(barGone, 'Announcement bar: dismisses on X click');
  } else {
    log(false, 'Announcement bar: dismiss button not found');
  }

  await page.close();
}

async function testCoSoPage(browser) {
  console.log('\n📋 CO-SO PAGE TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/co-so`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(4000);

  const content = await page.locator('main, body').textContent().catch(() => '');
  const hasContent = content.length > 100;
  log(hasContent, 'Co-so page: loads without crash', `${content.length} chars`);

  // Should not show unhandled error
  const hasUnhandledError = content.includes('Application error') || content.includes('Internal Server Error');
  log(!hasUnhandledError, 'Co-so page: no unhandled 500 error');

  await page.close();
}

async function testBranchDetailFallback(browser) {
  console.log('\n📋 BRANCH DETAIL + BACK NAVIGATION');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);

  // Navigate to /co-so page
  await page.goto(`${BASE}/co-so`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  // Go back to homepage
  await page.goBack();
  await page.waitForTimeout(2000);

  const url = page.url();
  const isHome = url === BASE + '/' || url === BASE;
  log(isHome, 'Back navigation: returns to homepage', url);

  // Homepage should still render correctly
  const heroVisible = await page.locator('h1').first().isVisible({ timeout: 3000 }).catch(() => false);
  log(heroVisible, 'After back navigation: homepage hero still visible');

  await page.close();
}

async function testMobile(browser) {
  console.log('\n📋 MOBILE VIEWPORT TESTS');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);

  // Hero visible on mobile
  const heroText = await page.locator('h1').first().textContent().catch(() => '');
  log(heroText.length > 5, 'Mobile: hero h1 visible');

  // SocialRegistration channel buttons on mobile
  const totalH = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h * 0.72), totalH);
  await page.waitForTimeout(1800);
  await dismissPopup(page);
  await page.waitForTimeout(500);

  const channelButtons = await page.locator('[class*="channelButton"]').count();
  log(channelButtons === 4, `Mobile SocialReg: 4 channel buttons`, `found ${channelButtons}`);

  await page.close();
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
const browser = await chromium.launch();

try {
  await testHomepage(browser);
  await testNavigation(browser);
  await testNewsFallback(browser);
  await testAnnouncementBar(browser);
  await testPostsPage(browser);
  await testCoSoPage(browser);
  await testBranchDetailFallback(browser);
  await testMobile(browser);
} finally {
  await browser.close();
}

const total = passed + failed;
console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed}/${total} passed${failed > 0 ? `, ${failed} FAILED` : ' ✓'}`);
if (failed > 0) process.exit(1);
