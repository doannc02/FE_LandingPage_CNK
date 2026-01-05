# Quick Start Guide - Multi-Tenant Headless CMS

## 🎯 Mục tiêu

Hướng dẫn này sẽ giúp bạn:
1. Setup môi trường development
2. Tạo Backend API với .NET 8
3. Tạo Frontend Runtime Engine với React + Vite
4. Test hệ thống với tenant đầu tiên

**Thời gian ước tính**: 2-3 ngày

---

## 📋 Prerequisites

### Software Requirements

Cài đặt các công cụ sau:

```bash
# 1. .NET 8 SDK
# Download: https://dotnet.microsoft.com/download/dotnet/8.0
dotnet --version  # Should be 8.0.x

# 2. Node.js 18+ & npm
# Download: https://nodejs.org/
node --version    # Should be 18.x or higher
npm --version

# 3. PostgreSQL 15+
# Download: https://www.postgresql.org/download/
psql --version

# 4. Redis (Optional for now, can add later)
# Download: https://redis.io/download

# 5. Git
git --version

# 6. Code Editor
# VS Code (recommended): https://code.visualstudio.com/
# Visual Studio 2022: https://visualstudio.microsoft.com/
```

### VS Code Extensions (Recommended)

```
- C# Dev Kit
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostgreSQL (by Chris Kolkman)
```

---

## 🚀 Phase 1: Backend Setup (Day 1)

### Step 1.1: Create .NET 8 Solution

```bash
# Create solution directory
mkdir NunchakuCMS
cd NunchakuCMS

# Create solution file
dotnet new sln -n NunchakuCMS

# Create projects
dotnet new classlib -n NunchakuCMS.Domain -o src/NunchakuCMS.Domain
dotnet new classlib -n NunchakuCMS.Application -o src/NunchakuCMS.Application
dotnet new classlib -n NunchakuCMS.Infrastructure -o src/NunchakuCMS.Infrastructure
dotnet new webapi -n NunchakuCMS.API -o src/NunchakuCMS.API

# Add projects to solution
dotnet sln add src/NunchakuCMS.Domain/NunchakuCMS.Domain.csproj
dotnet sln add src/NunchakuCMS.Application/NunchakuCMS.Application.csproj
dotnet sln add src/NunchakuCMS.Infrastructure/NunchakuCMS.Infrastructure.csproj
dotnet sln add src/NunchakuCMS.API/NunchakuCMS.API.csproj

# Add project references
cd src/NunchakuCMS.Application
dotnet add reference ../NunchakuCMS.Domain/NunchakuCMS.Domain.csproj

cd ../NunchakuCMS.Infrastructure
dotnet add reference ../NunchakuCMS.Domain/NunchakuCMS.Domain.csproj
dotnet add reference ../NunchakuCMS.Application/NunchakuCMS.Application.csproj

cd ../NunchakuCMS.API
dotnet add reference ../NunchakuCMS.Application/NunchakuCMS.Application.csproj
dotnet add reference ../NunchakuCMS.Infrastructure/NunchakuCMS.Infrastructure.csproj

cd ../../
```

### Step 1.2: Install NuGet Packages

```bash
# Domain layer (minimal dependencies)
cd src/NunchakuCMS.Domain

# Application layer
cd ../NunchakuCMS.Application
dotnet add package MediatR
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

# Infrastructure layer
cd ../NunchakuCMS.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package StackExchange.Redis
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File

# API layer
cd ../NunchakuCMS.API
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Serilog.AspNetCore

cd ../../
```

### Step 1.3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nunchaku_cms;
CREATE USER cms_admin WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE nunchaku_cms TO cms_admin;

\q
```

### Step 1.4: Configure Connection String

Edit `src/NunchakuCMS.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=nunchaku_cms;Username=cms_admin;Password=your_password_here"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "NunchakuCMS",
    "Audience": "NunchakuCMS.API",
    "ExpiryMinutes": 60
  },
  "Redis": {
    "Enabled": false,
    "ConnectionString": "localhost:6379"
  }
}
```

### Step 1.5: Create First Entity (Tenant)

Create `src/NunchakuCMS.Domain/Entities/Tenant.cs`:

```csharp
namespace NunchakuCMS.Domain.Entities;

public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public TenantStatus Status { get; set; } = TenantStatus.Active;
    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? Settings { get; set; } // JSON

    // Navigation
    public Guid? ThemeId { get; set; }
    public Theme? Theme { get; set; }
    public ICollection<Page> Pages { get; set; } = new List<Page>();
}

public enum TenantStatus
{
    Active = 0,
    Suspended = 1,
    Trial = 2
}

public enum SubscriptionPlan
{
    Free = 0,
    Basic = 1,
    Pro = 2,
    Enterprise = 3
}
```

### Step 1.6: Create DbContext

Create `src/NunchakuCMS.Infrastructure/Data/ApplicationDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using NunchakuCMS.Domain.Entities;

namespace NunchakuCMS.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Theme> Themes => Set<Theme>();
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<Section> Sections => Set<Section>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
```

### Step 1.7: Create First Migration

```bash
cd src/NunchakuCMS.API

# Add migration
dotnet ef migrations add InitialCreate --project ../NunchakuCMS.Infrastructure/NunchakuCMS.Infrastructure.csproj --context ApplicationDbContext

# Apply migration
dotnet ef database update --project ../NunchakuCMS.Infrastructure/NunchakuCMS.Infrastructure.csproj --context ApplicationDbContext
```

### Step 1.8: Create First API Endpoint

Create `src/NunchakuCMS.API/Controllers/TenantsController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NunchakuCMS.Infrastructure.Data;
using NunchakuCMS.Domain.Entities;

namespace NunchakuCMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TenantsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTenants()
    {
        var tenants = await _context.Tenants.ToListAsync();
        return Ok(new { isSuccess = true, data = tenants });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantDto dto)
    {
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Slug = dto.Slug,
            Domain = dto.Domain,
            Status = TenantStatus.Active,
            Plan = SubscriptionPlan.Free
        };

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        return Ok(new { isSuccess = true, data = tenant.Id });
    }
}

public record CreateTenantDto(string Name, string Slug, string? Domain);
```

### Step 1.9: Run Backend

```bash
cd src/NunchakuCMS.API
dotnet run

# Should see:
# Now listening on: https://localhost:7001
# Now listening on: http://localhost:5001
```

Test API:
```bash
# Create tenant
curl -X POST http://localhost:5001/api/tenants \
  -H "Content-Type: application/json" \
  -d '{"name":"CLB Côn Nhị Khúc","slug":"con-nhi-khuc","domain":null}'

# Get tenants
curl http://localhost:5001/api/tenants
```

✅ **Backend Phase 1 Complete!**

---

## 🎨 Phase 2: Frontend Setup (Day 2)

### Step 2.1: Create Vite React Project

```bash
# Go to root directory
cd ../../

# Create frontend project
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer
npm install framer-motion
npm install react-router-dom

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 2.2: Configure Tailwind

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
}
```

### Step 2.3: Create API Client

Create `src/api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add tenant header if available
apiClient.interceptors.request.use((config) => {
  const tenantSlug = window.location.hostname.split('.')[0];
  if (tenantSlug && tenantSlug !== 'localhost') {
    config.headers['X-Tenant-Slug'] = tenantSlug;
  }
  return config;
});

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: string;
}
```

### Step 2.4: Create Section Registry

Create `src/core/SectionRegistry.tsx`:

```typescript
import { FC } from 'react';

export interface SectionProps {
  config: any;
  isActive: boolean;
}

// Section components (to be implemented)
export const HeroSection: FC<SectionProps> = ({ config }) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <div>
        <h1 className="text-6xl font-bold text-white">{config.title}</h1>
        <p className="text-xl text-gray-300">{config.description}</p>
      </div>
    </section>
  );
};

export const SectionRegistry: Record<string, FC<SectionProps>> = {
  hero: HeroSection,
  // Add more sections as you build them
};
```

### Step 2.5: Create Page Renderer

Create `src/core/PageRenderer.tsx`:

```typescript
import { FC } from 'react';
import { SectionRegistry } from './SectionRegistry';

interface Section {
  id: string;
  type: string;
  config: any;
  isActive: boolean;
}

interface PageRendererProps {
  sections: Section[];
}

export const PageRenderer: FC<PageRendererProps> = ({ sections }) => {
  return (
    <>
      {sections
        .filter((section) => section.isActive)
        .map((section) => {
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
    </>
  );
};
```

### Step 2.6: Create Main App

Edit `src/App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { PageRenderer } from './core/PageRenderer';
import { apiClient } from './api/client';

const queryClient = new QueryClient();

function App() {
  const [pageConfig, setPageConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch page configuration
    const fetchPageConfig = async () => {
      try {
        const response = await apiClient.get('/pages/home/config');
        setPageConfig(response.data.data);
      } catch (error) {
        console.error('Failed to fetch page config:', error);
        // Use mock data for now
        setPageConfig({
          sections: [
            {
              id: '1',
              type: 'hero',
              isActive: true,
              config: {
                title: 'Côn Nhị Khúc Hà Đông',
                description: 'Rèn luyện tinh thần chiến binh',
              },
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPageConfig();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Loading...</div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PageRenderer sections={pageConfig.sections} />
    </QueryClientProvider>
  );
}

export default App;
```

### Step 2.7: Run Frontend

```bash
npm run dev

# Should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

✅ **Frontend Phase 2 Complete!**

---

## 🧪 Phase 3: Test Integration (Day 3)

### Step 3.1: Create Test Tenant via API

```bash
curl -X POST http://localhost:5001/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CLB Côn Nhị Khúc Hà Đông",
    "slug": "con-nhi-khuc-hadong",
    "domain": null
  }'
```

### Step 3.2: Create Theme

```bash
curl -X POST http://localhost:5001/api/themes \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-id-here",
    "name": "Martial Arts Dark",
    "primaryColor": "#C41E3A",
    "secondaryColor": "#D4AF37",
    "fontDisplay": "Oswald",
    "fontBody": "Roboto"
  }'
```

### Step 3.3: Create Page

```bash
curl -X POST http://localhost:5001/api/pages \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-id-here",
    "title": "Trang chủ",
    "slug": "home",
    "path": "/",
    "isHomePage": true
  }'
```

### Step 3.4: Create Section

```bash
curl -X POST http://localhost:5001/api/sections \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-id-here",
    "pageId": "your-page-id-here",
    "type": "hero",
    "name": "Hero Section",
    "displayOrder": 1,
    "config": {
      "title": "Côn Nhị Khúc Hà Đông",
      "description": "Rèn luyện tinh thần chiến binh"
    }
  }'
```

### Step 3.5: Test Frontend Rendering

Open browser:
```
http://localhost:5173/
```

You should see the hero section with dynamic content!

✅ **Integration Test Complete!**

---

## 📚 Next Steps

After completing this Quick Start:

1. **Implement remaining sections**:
   - AboutSection
   - BlogSection
   - ContactSection
   - etc.

2. **Add Admin Portal**:
   - Create admin UI for managing tenants, pages, sections
   - Implement WYSIWYG editor

3. **Implement CQRS**:
   - Refactor controllers to use MediatR
   - Add FluentValidation

4. **Add Authentication**:
   - JWT auth
   - Role-based permissions

5. **Add Caching**:
   - Redis for page configs
   - Cache invalidation

6. **Deploy**:
   - Docker setup
   - CI/CD pipeline
   - Production deployment

---

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `psql -U postgres`
- Verify connection string in `appsettings.Development.json`
- Run migrations: `dotnet ef database update`

### Frontend can't connect to API
- Check API is running on http://localhost:5001
- Update `VITE_API_URL` in `.env.local`
- Check CORS settings in backend

### Database errors
- Drop and recreate database if needed
- Rerun all migrations

---

## 📞 Support

Nếu gặp vấn đề, tham khảo:
- Main architecture plan: `ARCHITECTURE_PLAN.md`
- Example configs: `docs/examples/`
- .NET documentation: https://learn.microsoft.com/dotnet/
- React + Vite: https://vitejs.dev/

Good luck! 🚀
