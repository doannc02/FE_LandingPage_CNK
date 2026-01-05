# Multi-Tenant Headless CMS - Architecture & Implementation Plan

## 📋 Executive Summary

Chuyển đổi hệ thống landing page hiện tại thành một **Multi-Tenant Headless CMS Platform** cho phép:
- **Admin Portal**: Quản lý nhiều tenant, tạo/quản lý pages, sections, themes, content
- **Frontend Runtime Engine**: Render động giao diện từ JSON configuration
- **Backend API (.NET 8)**: Clean Architecture + CQRS, PostgreSQL, Redis caching
- **Multi-tenancy**: Phân biệt tenant theo domain hoặc slug

---

## 🏗️ OVERALL SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
├──────────────────────┬──────────────────────────────────────┤
│  User Frontend       │   Admin Portal                        │
│  (React + Vite)      │   (React + Next.js or Vite)          │
│  - Runtime Engine    │   - Tenant Management                 │
│  - Theme Engine      │   - Page Builder                      │
│  - Dynamic Renderer  │   - Section Config                    │
│                      │   - Content Management                │
└──────────────────────┴──────────────────────────────────────┘
                           │
                           │ REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (.NET 8 Web API)                    │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (Controllers)                            │
│    - API Versioning                                          │
│    - Global Exception Handler                                │
│    - Tenant Resolution Middleware                            │
├─────────────────────────────────────────────────────────────┤
│  Application Layer (CQRS with MediatR)                       │
│    - Commands & Queries                                      │
│    - Validators (FluentValidation)                           │
│    - DTOs & Mappers (AutoMapper)                             │
├─────────────────────────────────────────────────────────────┤
│  Domain Layer                                                │
│    - Entities (Tenant, Page, Section, Theme, etc.)          │
│    - Value Objects                                           │
│    - Domain Events                                           │
│    - Repository Interfaces                                   │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                        │
│    - EF Core (PostgreSQL)                                    │
│    - Redis Cache                                             │
│    - File Storage (Local/S3)                                 │
│    - Identity & JWT Auth                                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
├──────────────────────┬──────────────────────────────────────┤
│   PostgreSQL         │   Redis Cache                         │
│   - Multi-tenant DB  │   - Session cache                     │
│   - Indexed queries  │   - Config cache                      │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA DESIGN

### Core Entities

#### 1. **Tenants** (Multi-tenant core)
```sql
Tenants
├── Id (UUID, PK)
├── Name (string) -- "CLB Côn Nhị Khúc"
├── Slug (string, unique) -- "con-nhi-khuc-hadong"
├── Domain (string, nullable, unique) -- "nunchaku-hadong.com"
├── Status (enum) -- Active, Suspended, Trial
├── SubscriptionPlan (enum) -- Free, Basic, Pro, Enterprise
├── CreatedAt, UpdatedAt
├── Settings (JSONB) -- Additional settings
└── ThemeId (FK -> Themes)
```

#### 2. **Themes** (Visual identity)
```sql
Themes
├── Id (UUID, PK)
├── TenantId (FK -> Tenants)
├── Name (string) -- "Martial Arts Dark"
├── IsActive (bool)
├── PrimaryColor (string) -- "#C41E3A"
├── SecondaryColor (string) -- "#D4AF37"
├── FontDisplay (string) -- "Oswald"
├── FontBody (string) -- "Roboto"
├── Logo (string, URL)
├── Favicon (string, URL)
├── CustomCSS (text, nullable)
└── CreatedAt, UpdatedAt
```

#### 3. **Pages** (Dynamic pages)
```sql
Pages
├── Id (UUID, PK)
├── TenantId (FK -> Tenants, indexed)
├── Title (string) -- "Trang chủ"
├── Slug (string) -- "home", "about-us"
├── Path (string) -- "/", "/ve-chung-toi"
├── IsHomePage (bool)
├── IsActive (bool)
├── MetaTitle (string)
├── MetaDescription (string)
├── MetaKeywords (string)
├── OgImage (string, URL)
├── LayoutConfig (JSONB) -- Stores section order
├── CreatedAt, UpdatedAt, PublishedAt
└── UNIQUE INDEX (TenantId, Slug)
```

#### 4. **Sections** (Reusable sections)
```sql
Sections
├── Id (UUID, PK)
├── TenantId (FK -> Tenants)
├── PageId (FK -> Pages, nullable)
├── Type (enum) -- Hero, About, Blog, Contact, Gallery, Custom
├── Name (string) -- "Hero Section - Homepage"
├── DisplayOrder (int)
├── IsActive (bool)
├── Config (JSONB) -- Section-specific configuration
├── CreatedAt, UpdatedAt
└── INDEX (PageId, DisplayOrder)
```

**Example Section Config (Hero):**
```json
{
  "type": "hero",
  "title": "Côn Nhị Khúc Hà Đông",
  "subtitle": "Rèn luyện tinh thần chiến binh",
  "backgroundImage": "/images/hero-bg.jpg",
  "ctaButtons": [
    { "text": "Đăng ký học", "link": "/register", "style": "primary" },
    { "text": "Xem khóa học", "link": "/courses", "style": "outline" }
  ],
  "stats": [
    { "number": "10+", "label": "Năm kinh nghiệm" },
    { "number": "500+", "label": "Học viên" }
  ],
  "animation": {
    "enabled": true,
    "type": "fade-in-up"
  }
}
```

#### 5. **Posts** (Content - existing)
```sql
Posts (extend existing)
├── Id (UUID, PK)
├── TenantId (FK -> Tenants) -- ADD THIS
├── ... (existing fields)
└── INDEX (TenantId, Status, PublishedAt)
```

#### 6. **Categories**, **Courses**, **Comments** (extend with TenantId)

#### 7. **Users & Roles**
```sql
Users
├── Id (UUID, PK)
├── Email, PasswordHash
├── FullName, Phone
└── CreatedAt, UpdatedAt

TenantUsers (Many-to-many)
├── TenantId (FK -> Tenants)
├── UserId (FK -> Users)
├── Role (enum) -- SuperAdmin, TenantAdmin, Editor, Viewer
└── PRIMARY KEY (TenantId, UserId)
```

---

## 🎨 FRONTEND ARCHITECTURE

### 1. User Frontend (React + Vite)

**Tech Stack:**
- React 18 + TypeScript
- Vite (fast build tool)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- Framer Motion (animations)

**Key Components:**

```typescript
// Runtime Engine Architecture
src/
├── core/
│   ├── SectionRegistry.ts       // Maps section type -> component
│   ├── ThemeEngine.ts            // Applies dynamic theme
│   ├── PageRenderer.tsx          // Renders page from config
│   └── SEOManager.tsx            // Dynamic SEO injection
├── sections/                     // Reusable section components
│   ├── HeroSection/
│   │   ├── HeroSection.tsx
│   │   ├── HeroConfig.ts        // TypeScript interface for config
│   │   └── HeroSection.module.css
│   ├── AboutSection/
│   ├── BlogSection/
│   ├── ContactSection/
│   └── index.ts                 // Export all sections
├── api/
│   ├── client.ts
│   ├── tenant.api.ts
│   └── page.api.ts
├── hooks/
│   ├── useTenant.ts
│   ├── usePage.ts
│   └── useTheme.ts
└── App.tsx                      // Main runtime app
```

**Core Logic:**

```typescript
// SectionRegistry.ts
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
// ... import all sections

export const SectionRegistry = {
  hero: HeroSection,
  about: AboutSection,
  blog: BlogSection,
  contact: ContactSection,
  gallery: GallerySection,
  custom: CustomSection,
};

export type SectionType = keyof typeof SectionRegistry;
```

```typescript
// PageRenderer.tsx
import { SectionRegistry } from './SectionRegistry';

interface PageRendererProps {
  pageConfig: PageConfig;
}

export function PageRenderer({ pageConfig }: PageRendererProps) {
  const { sections, theme } = pageConfig;

  return (
    <div data-theme={theme.name}>
      {sections.map((section) => {
        const SectionComponent = SectionRegistry[section.type];

        if (!SectionComponent) {
          console.warn(`Section type "${section.type}" not found`);
          return null;
        }

        return (
          <SectionComponent
            key={section.id}
            config={section.config}
            isActive={section.isActive}
          />
        );
      })}
    </div>
  );
}
```

**Theme Engine:**
```typescript
// ThemeEngine.ts
export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--font-display', theme.fontDisplay);
  root.style.setProperty('--font-body', theme.fontBody);

  // Update favicon
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.setAttribute('href', theme.favicon);
  }
}
```

---

### 2. Admin Portal

**Options:**
1. **Next.js Admin** (Recommended for quick start)
   - Same repo, separate `/admin` route
   - Reuse existing API client
   - SSR for better SEO

2. **Separate Vite App** (For scalability)
   - Independent deployment
   - Lighter bundle
   - Modern dev experience

**Key Features:**
```
Admin Portal
├── Dashboard
│   ├── Tenant Overview
│   ├── Analytics
│   └── Quick Actions
├── Tenants Management (SuperAdmin only)
│   ├── List Tenants
│   ├── Create/Edit Tenant
│   └── Tenant Settings
├── Pages Management
│   ├── Page List
│   ├── Create/Edit Page
│   └── Page Builder
│       ├── Add/Remove Sections
│       ├── Reorder Sections (Drag & Drop)
│       └── Configure Section (JSON editor + Form)
├── Content Management
│   ├── Posts (Blog)
│   ├── Courses
│   ├── Gallery
│   └── Media Library
├── Theme Customizer
│   ├── Colors (Color picker)
│   ├── Fonts (Google Fonts selector)
│   ├── Logo/Favicon Upload
│   └── Custom CSS
├── SEO Settings
│   └── Meta tags per page
└── Users & Permissions
    ├── Invite Users
    └── Role Management
```

**UI Libraries:**
- **shadcn/ui** + Tailwind (Modern, customizable)
- **Ant Design** (Enterprise-ready, rich components)
- **MUI** (Material Design)

**Key Dependencies:**
```json
{
  "@tanstack/react-query": "^5.x",
  "@dnd-kit/core": "^6.x",         // Drag & drop
  "react-hook-form": "^7.x",        // Forms
  "zod": "^3.x",                    // Validation
  "monaco-editor": "^0.x",          // JSON editor
  "react-color": "^2.x"             // Color picker
}
```

---

## 🔧 BACKEND .NET 8 ARCHITECTURE

### Clean Architecture Structure

```
NunchakuCMS/
├── src/
│   ├── NunchakuCMS.Domain/
│   │   ├── Entities/
│   │   │   ├── Tenant.cs
│   │   │   ├── Page.cs
│   │   │   ├── Section.cs
│   │   │   ├── Theme.cs
│   │   │   ├── Post.cs
│   │   │   └── User.cs
│   │   ├── ValueObjects/
│   │   ├── Events/
│   │   ├── Exceptions/
│   │   └── Interfaces/
│   │       └── IRepository.cs
│   │
│   ├── NunchakuCMS.Application/
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   │   ├── ValidationBehavior.cs
│   │   │   │   └── LoggingBehavior.cs
│   │   │   ├── Interfaces/
│   │   │   │   ├── ITenantService.cs
│   │   │   │   └── ICurrentTenantService.cs
│   │   │   └── DTOs/
│   │   │       └── ApiResponse.cs
│   │   ├── Tenants/
│   │   │   ├── Commands/
│   │   │   │   ├── CreateTenant/
│   │   │   │   │   ├── CreateTenantCommand.cs
│   │   │   │   │   ├── CreateTenantCommandHandler.cs
│   │   │   │   │   └── CreateTenantValidator.cs
│   │   │   │   └── UpdateTenant/
│   │   │   └── Queries/
│   │   │       ├── GetTenantById/
│   │   │       └── GetTenantByDomain/
│   │   ├── Pages/
│   │   │   ├── Commands/
│   │   │   │   ├── CreatePage/
│   │   │   │   ├── UpdatePage/
│   │   │   │   └── DeletePage/
│   │   │   └── Queries/
│   │   │       ├── GetPageById/
│   │   │       ├── GetPageBySlug/
│   │   │       └── GetPageConfig/
│   │   ├── Sections/
│   │   ├── Themes/
│   │   └── Posts/ (existing - refactor for multi-tenant)
│   │
│   ├── NunchakuCMS.Infrastructure/
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── Configurations/
│   │   │   │   ├── TenantConfiguration.cs
│   │   │   │   ├── PageConfiguration.cs
│   │   │   │   └── SectionConfiguration.cs
│   │   │   └── Migrations/
│   │   ├── Repositories/
│   │   │   ├── TenantRepository.cs
│   │   │   ├── PageRepository.cs
│   │   │   └── GenericRepository.cs
│   │   ├── Services/
│   │   │   ├── CurrentTenantService.cs
│   │   │   └── CacheService.cs
│   │   ├── Identity/
│   │   │   └── JwtTokenService.cs
│   │   └── Caching/
│   │       └── RedisCacheService.cs
│   │
│   └── NunchakuCMS.API/
│       ├── Controllers/
│       │   ├── TenantsController.cs
│       │   ├── PagesController.cs
│       │   ├── SectionsController.cs
│       │   ├── ThemesController.cs
│       │   └── PostsController.cs (existing - refactor)
│       ├── Middlewares/
│       │   ├── TenantResolutionMiddleware.cs
│       │   ├── ExceptionHandlingMiddleware.cs
│       │   └── RequestLoggingMiddleware.cs
│       ├── Filters/
│       │   └── TenantAuthorizationFilter.cs
│       ├── Program.cs
│       └── appsettings.json
│
└── tests/
    ├── NunchakuCMS.UnitTests/
    └── NunchakuCMS.IntegrationTests/
```

### Key Backend Features

#### 1. **Multi-Tenancy Implementation**

```csharp
// TenantResolutionMiddleware.cs
public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context, ICurrentTenantService tenantService)
    {
        // Strategy 1: Domain-based
        var host = context.Request.Host.Value;
        var tenant = await ResolveTenantByDomain(host);

        // Strategy 2: Subdomain-based
        if (tenant == null)
        {
            var subdomain = ExtractSubdomain(host);
            tenant = await ResolveTenantBySlug(subdomain);
        }

        // Strategy 3: Header-based (for API clients)
        if (tenant == null && context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantId))
        {
            tenant = await ResolveTenantById(tenantId);
        }

        if (tenant != null)
        {
            tenantService.SetTenant(tenant);
        }

        await _next(context);
    }
}
```

```csharp
// ApplicationDbContext.cs with Query Filters
public class ApplicationDbContext : DbContext
{
    private readonly ICurrentTenantService _tenantService;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global query filter for multi-tenant entities
        modelBuilder.Entity<Page>()
            .HasQueryFilter(p => p.TenantId == _tenantService.TenantId);

        modelBuilder.Entity<Post>()
            .HasQueryFilter(p => p.TenantId == _tenantService.TenantId);

        // ... other entities
    }
}
```

#### 2. **CQRS Example**

```csharp
// CreatePageCommand.cs
public record CreatePageCommand(
    string Title,
    string Slug,
    string Path,
    bool IsHomePage,
    List<SectionConfigDto> Sections,
    SEOMetadata SEO
) : IRequest<ApiResponse<Guid>>;

// CreatePageCommandHandler.cs
public class CreatePageCommandHandler : IRequestHandler<CreatePageCommand, ApiResponse<Guid>>
{
    private readonly IRepository<Page> _pageRepository;
    private readonly ICurrentTenantService _tenantService;
    private readonly ICacheService _cache;

    public async Task<ApiResponse<Guid>> Handle(CreatePageCommand request, CancellationToken ct)
    {
        var page = new Page
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantService.TenantId,
            Title = request.Title,
            Slug = request.Slug,
            Path = request.Path,
            IsHomePage = request.IsHomePage,
            LayoutConfig = JsonSerializer.Serialize(request.Sections),
            MetaTitle = request.SEO.Title,
            MetaDescription = request.SEO.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _pageRepository.AddAsync(page, ct);

        // Invalidate cache
        await _cache.RemoveAsync($"page:{_tenantService.TenantId}:{request.Slug}");

        return ApiResponse<Guid>.Success(page.Id);
    }
}

// CreatePageValidator.cs
public class CreatePageValidator : AbstractValidator<CreatePageCommand>
{
    public CreatePageValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().Matches("^[a-z0-9-]+$");
        RuleFor(x => x.Path).NotEmpty().Matches("^/[a-z0-9-/]*$");
    }
}
```

#### 3. **API Response Structure**

```csharp
// ApiResponse.cs
public class ApiResponse<T>
{
    public bool IsSuccess { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public List<string>? ValidationErrors { get; set; }

    public static ApiResponse<T> Success(T data) => new()
    {
        IsSuccess = true,
        Data = data
    };

    public static ApiResponse<T> Failure(string error) => new()
    {
        IsSuccess = false,
        Error = error
    };
}
```

#### 4. **Caching Strategy**

```csharp
public class CachedPageQueryHandler : IRequestHandler<GetPageBySlugQuery, PageConfigDto>
{
    private readonly IRepository<Page> _pageRepository;
    private readonly ICurrentTenantService _tenantService;
    private readonly ICacheService _cache;

    public async Task<PageConfigDto> Handle(GetPageBySlugQuery request, CancellationToken ct)
    {
        var cacheKey = $"page:{_tenantService.TenantId}:{request.Slug}";

        var cached = await _cache.GetAsync<PageConfigDto>(cacheKey);
        if (cached != null)
            return cached;

        var page = await _pageRepository
            .AsQueryable()
            .Include(p => p.Sections)
            .FirstOrDefaultAsync(p => p.Slug == request.Slug, ct);

        if (page == null)
            throw new NotFoundException($"Page '{request.Slug}' not found");

        var dto = MapToDto(page);

        await _cache.SetAsync(cacheKey, dto, TimeSpan.FromMinutes(10));

        return dto;
    }
}
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **Phase 1: Foundation (Week 1-2)**

**Backend:**
- [ ] Setup .NET 8 Clean Architecture structure
- [ ] Setup PostgreSQL database
- [ ] Implement core entities: Tenant, Theme, User
- [ ] Setup EF Core with migrations
- [ ] Implement multi-tenancy middleware
- [ ] Setup JWT authentication
- [ ] Implement basic CQRS for Tenants

**Frontend:**
- [ ] Create new Vite + React project
- [ ] Setup TanStack Query
- [ ] Setup Tailwind CSS
- [ ] Create base API client
- [ ] Implement tenant resolution logic

**Deliverable:** Backend API với tenant CRUD, Frontend có thể fetch tenant info

---

### **Phase 2: Page & Section Management (Week 3-4)**

**Backend:**
- [ ] Implement Page entity & CQRS
- [ ] Implement Section entity & CQRS
- [ ] Create endpoints:
  - `GET /api/pages/{slug}/config` - Get page configuration
  - `POST /api/pages` - Create page (Admin)
  - `PUT /api/pages/{id}` - Update page
  - `POST /api/sections` - Create section
  - `PUT /api/sections/{id}/reorder` - Reorder sections
- [ ] Implement Redis caching for page configs

**Frontend:**
- [ ] Create SectionRegistry
- [ ] Implement PageRenderer component
- [ ] Migrate existing sections:
  - [ ] HeroSection
  - [ ] AboutSection
  - [ ] BlogSection
  - [ ] ContactSection
  - [ ] GallerySection
- [ ] Create Section config TypeScript interfaces

**Deliverable:** Runtime engine có thể render page từ JSON config

---

### **Phase 3: Theme Engine (Week 5)**

**Backend:**
- [ ] Implement Theme entity & CQRS
- [ ] Create theme endpoints:
  - `GET /api/tenants/{id}/theme`
  - `PUT /api/tenants/{id}/theme`
- [ ] Implement file upload for logo/favicon (Local or S3)

**Frontend:**
- [ ] Implement ThemeEngine
- [ ] Apply dynamic CSS variables
- [ ] Handle logo/favicon injection
- [ ] Add theme preview mode

**Deliverable:** Tenant có thể customize colors, fonts, logo

---

### **Phase 4: Admin Portal - Basic (Week 6-7)**

**Admin Frontend:**
- [ ] Setup admin project (Next.js or Vite)
- [ ] Implement authentication & authorization
- [ ] Create layouts: Sidebar navigation
- [ ] **Tenant Management** (SuperAdmin only):
  - [ ] Tenant list
  - [ ] Create/Edit tenant
- [ ] **Page Management**:
  - [ ] Page list
  - [ ] Create/Edit page (basic form)
- [ ] **Section Management**:
  - [ ] Add section to page
  - [ ] Section list with reorder (drag-drop)
  - [ ] JSON editor for section config

**Deliverable:** Admin có thể tạo tenant, pages, sections cơ bản

---

### **Phase 5: Content Management (Week 8)**

**Backend:**
- [ ] Refactor existing Post, Course, Category entities
- [ ] Add TenantId to all content entities
- [ ] Update query filters for multi-tenancy
- [ ] Migrate existing data

**Admin Frontend:**
- [ ] **Post Management**:
  - [ ] Post list
  - [ ] Rich text editor (TipTap or Quill)
  - [ ] Category/Tag management
- [ ] **Course Management**
- [ ] **Media Library**:
  - [ ] Upload images
  - [ ] Image browser

**Deliverable:** Admin có thể quản lý content (posts, courses)

---

### **Phase 6: Advanced Features (Week 9-10)**

**Backend:**
- [ ] Implement SEO metadata APIs
- [ ] Add analytics tracking
- [ ] Implement audit logs
- [ ] Setup background jobs (Hangfire)

**Admin Frontend:**
- [ ] **Theme Customizer**:
  - [ ] Color picker
  - [ ] Font selector (Google Fonts API)
  - [ ] Custom CSS editor (Monaco)
- [ ] **SEO Manager**:
  - [ ] Meta tags editor per page
  - [ ] OG image uploader
- [ ] **User Management**:
  - [ ] Invite users to tenant
  - [ ] Role-based permissions

**Frontend:**
- [ ] SEO Manager: Dynamic meta tag injection
- [ ] Performance optimization
- [ ] Lazy loading sections

**Deliverable:** Full-featured CMS với theme, SEO, user management

---

### **Phase 7: Polish & Production (Week 11-12)**

- [ ] **Testing**:
  - [ ] Unit tests (Backend)
  - [ ] Integration tests
  - [ ] E2E tests (Playwright)
- [ ] **Documentation**:
  - [ ] API documentation (Swagger)
  - [ ] Admin user guide
  - [ ] Developer docs
- [ ] **DevOps**:
  - [ ] Docker compose setup
  - [ ] CI/CD pipeline (GitHub Actions)
  - [ ] Deploy to production (Azure/AWS/Vercel)
- [ ] **Security**:
  - [ ] Security audit
  - [ ] Rate limiting
  - [ ] CORS configuration
- [ ] **Performance**:
  - [ ] Database indexing
  - [ ] Redis caching optimization
  - [ ] CDN setup for static assets

**Deliverable:** Production-ready multi-tenant CMS

---

## 📦 TECH STACK SUMMARY

### Backend
- **.NET 8** - Web API framework
- **PostgreSQL** - Primary database
- **Entity Framework Core** - ORM
- **MediatR** - CQRS implementation
- **FluentValidation** - Input validation
- **AutoMapper** - Object mapping
- **Redis** - Caching layer
- **Serilog** - Logging
- **Hangfire** (Optional) - Background jobs
- **Swashbuckle** - API documentation

### Frontend (User)
- **React 18 + TypeScript**
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing

### Admin Portal
- **React + Next.js** (or Vite)
- **shadcn/ui** - UI components
- **React Hook Form** - Forms
- **Zod** - Schema validation
- **@dnd-kit/core** - Drag & drop
- **Monaco Editor** - Code editor
- **React Color** - Color picker

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Azure/AWS** - Cloud hosting
- **Vercel/Netlify** - Frontend hosting

---

## ❓ DECISION POINTS (Need Your Input)

### 1. **Admin Portal: Same repo or separate?**
   - **Option A**: Next.js admin in same repo (`/admin` route)
     - ✅ Pros: Shared code, easier monorepo management
     - ❌ Cons: Larger bundle size for frontend users

   - **Option B**: Separate Vite app for admin
     - ✅ Pros: Independent deployment, cleaner separation
     - ❌ Cons: Code duplication for API client

   **Recommendation**: Start with Option A, migrate to B later if needed

### 2. **Tenant Resolution Strategy**
   - **Option A**: Domain-based (`client1.yoursaas.com`)
     - Requires wildcard DNS
   - **Option B**: Path-based (`yoursaas.com/client1`)
     - Easier setup
   - **Option C**: Hybrid (custom domain + fallback to subdomain)

   **Recommendation**: Option C for flexibility

### 3. **File Storage**
   - **Option A**: Local file system (simple, free)
   - **Option B**: AWS S3 / Azure Blob (scalable, CDN)

   **Recommendation**: Start with A, add B later

### 4. **Page Builder UI**
   - **Phase 1**: JSON editor (technical users)
   - **Phase 2**: Form-based editor (easier)
   - **Future**: Visual drag-drop builder (GrapesJS/Builder.io style)

   **Recommendation**: Phased approach

---

## 🎯 SUCCESS METRICS

- [ ] Admin can create a new tenant in < 2 minutes
- [ ] Admin can create a new page with 5 sections in < 5 minutes
- [ ] Frontend page load time < 2 seconds
- [ ] API response time < 200ms (cached), < 500ms (uncached)
- [ ] Support 100+ tenants on single instance
- [ ] Zero downtime deployments

---

## 📚 LEARNING RESOURCES

### Clean Architecture + CQRS
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern - Microsoft](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [MediatR Documentation](https://github.com/jbogard/MediatR)

### Multi-tenancy
- [Multi-tenant SaaS Database Patterns](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview)
- [EF Core Multi-tenancy](https://docs.microsoft.com/en-us/ef/core/miscellaneous/multitenancy)

### Frontend
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🔄 MIGRATION STRATEGY (From Current to New System)

1. **Phase 1**: Run old & new systems in parallel
2. **Phase 2**: Migrate "CLB Côn Nhị Khúc" as first tenant
3. **Phase 3**: Import existing posts, courses, content
4. **Phase 4**: Switch DNS to new system
5. **Phase 5**: Sunset old system

---

## 📝 NEXT STEPS

1. **Review this plan** - Xác nhận architecture approach
2. **Answer decision points** - Chọn options cho admin portal, tenant strategy, etc.
3. **Prioritize features** - Có thể bỏ features không cần thiết?
4. **Setup development environment** - Cài .NET 8, PostgreSQL, Node.js
5. **Start Phase 1** - Begin implementation!

---

**Questions?** Let's discuss any part of this plan!
