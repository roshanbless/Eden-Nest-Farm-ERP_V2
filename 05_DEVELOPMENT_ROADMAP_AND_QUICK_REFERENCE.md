# Eden Nest Farm ERP - Development Roadmap & Quick Reference

---

# DEVELOPMENT ROADMAP

## Phase 1: MVP (Weeks 1-12) - 100-500 Customers
**Goal**: Minimum viable ERP for direct order fulfillment and subscription management

### Sprint 0: Setup (Week 1)
- [ ] GitHub repository setup
- [ ] Supabase project creation
- [ ] Local development environment
- [ ] CI/CD pipeline configuration
- [ ] Database schema migration
- **Deliverable**: Production-ready infrastructure

### Sprint 1-2: Authentication (Weeks 2-3)
- [ ] User registration/login (JWT)
- [ ] Role-based access control (RBAC)
- [ ] Permission system
- [ ] Password reset
- [ ] Email verification
- **Deliverable**: Secure authentication system for 10 roles

### Sprint 3-4: Farm Management (Weeks 4-5)
- [ ] Multi-farm support
- [ ] Farm profile management
- [ ] Farm units (sheds) tracking
- [ ] Asset inventory
- [ ] Farm analytics dashboard
- **Deliverable**: Manage multiple farm locations

### Sprint 5-6: Production Tracking (Weeks 6-7)
- [ ] Daily production entry form
- [ ] Batch tracking
- [ ] Quality control checks
- [ ] Production analytics/charts
- [ ] Grade classification
- **Deliverable**: Real-time production monitoring

### Sprint 7-8: Order Management (Weeks 8-9)
- [ ] Order creation (website, app, sales team)
- [ ] Order status workflow
- [ ] Inventory allocation
- [ ] Invoice generation
- [ ] Order history tracking
- **Deliverable**: Complete order lifecycle

### Sprint 9-10: Subscription Engine (Weeks 10-11)
- [ ] Subscription plan creation
- [ ] Automatic billing cycle creation
- [ ] Payment processing
- [ ] Subscription pause/resume
- [ ] Renewal reminders
- [ ] Churn tracking
- **Deliverable**: Core recurring revenue system

### Sprint 11-12: Delivery & Analytics (Weeks 12)
- [ ] Delivery zone management
- [ ] Driver assignment
- [ ] Delivery tracking
- [ ] Executive dashboard (KPIs)
- [ ] Basic reports (sales, production)
- [ ] Payment reconciliation
- **Deliverable**: End-to-end order fulfillment

**MVP Cost**: $0-5/month (free tier)

---

## Phase 2: Growth (Weeks 13-24) - 500-5,000 Customers
**Goal**: Scale operations, add advanced features

### New Features
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration for orders
- [ ] Advanced analytics with forecasting
- [ ] Supplier management module
- [ ] Employee payroll
- [ ] Accounting module (GL posting)
- [ ] Customer churn prediction
- [ ] SMS/Email automation
- [ ] Multi-currency support (for international)
- [ ] API for third-party integrations

### Infrastructure
- [ ] Database optimization
- [ ] Caching layer (Redis)
- [ ] CDN for static assets
- [ ] Database backups (automated)
- [ ] Monitoring & alerting
- [ ] Log aggregation

### Growth Features
- [ ] Referral program
- [ ] Loyalty points
- [ ] Dynamic pricing
- [ ] Bulk order discounts
- [ ] Corporate accounts

**Phase 2 Cost**: $50-200/month

---

## Phase 3: Enterprise (Weeks 25+) - 5,000-10,000+ Customers
**Goal**: Enterprise-grade features, AI-powered insights

### Enterprise Features
- [ ] Franchise management system
- [ ] Multi-company support
- [ ] Advanced role management
- [ ] Custom workflows
- [ ] API marketplace
- [ ] White-label platform
- [ ] SSO/SAML support
- [ ] Advanced compliance

### AI/ML Features
- [ ] Demand forecasting
- [ ] Dynamic routing optimization
- [ ] Customer lifetime value prediction
- [ ] Inventory optimization
- [ ] Price optimization
- [ ] Churn prediction & retention
- [ ] Anomaly detection

### Infrastructure
- [ ] Kubernetes deployment
- [ ] Global CDN
- [ ] Database replication
- [ ] Disaster recovery
- [ ] 99.9% SLA
- [ ] Dedicated support

**Phase 3 Cost**: $500-2,000/month

---

# QUICK REFERENCE GUIDE

## Essential Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=http://localhost:3001/v1 (dev) or https://api.edennestfarm.com/v1 (prod)

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-super-secret-key-at-least-32-chars-long
JWT_EXPIRY=3600
NODE_ENV=development
PORT=3001

# Optional Services
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
SENDGRID_API_KEY=SG.xxx
```

## Core API Routes

```
# Authentication
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout

# Farms
GET    /farms
POST   /farms
GET    /farms/:farmId
PUT    /farms/:farmId
GET    /farms/:farmId/units

# Production
GET    /production
POST   /production/daily-entry
GET    /production/analytics

# Inventory
GET    /inventory
POST   /inventory/stock-in
POST   /inventory/stock-out

# Customers
GET    /customers
POST   /customers
GET    /customers/:customerId

# Orders
GET    /orders
POST   /orders
PUT    /orders/:orderId/status

# Subscriptions
GET    /subscriptions
POST   /subscriptions
POST   /subscriptions/:subscriptionId/pause
POST   /subscriptions/:subscriptionId/cancel

# Deliveries
GET    /deliveries
POST   /deliveries
PUT    /deliveries/:deliveryId/tracking

# Payments
POST   /payments/initiate
POST   /payments/webhook
POST   /payments/:paymentId/refund

# Analytics
GET    /dashboard/kpis
GET    /reports/sales
GET    /reports/production
GET    /reports/financial
```

## Database Key Tables

| Table | Purpose | Records |
|-------|---------|---------|
| users | Authentication | 10s |
| farms | Multi-farm support | 3-5 |
| production | Daily tracking | 1,000s/month |
| inventory | Stock management | 100s |
| customers | CRM | 100s-1000s |
| orders | Order management | 1000s/month |
| subscriptions | Recurring revenue | 100s-1000s |
| deliveries | Logistics | 100s-1000s/month |
| payments | Financial records | 1000s/month |

## Common Commands

```bash
# Start development
npm run dev              # Frontend (port 3000)
npm run start:dev        # Backend (port 3001)
docker-compose up        # Local PostgreSQL

# Testing
npm run test            # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage report

# Build
npm run build            # Production build
npm run lint             # Code quality
npm run format           # Format code

# Database
npm run migrate          # Run migrations
npm run seed             # Seed test data
npm run backup           # Database backup

# Deployment
npm run deploy:frontend  # Deploy to Vercel
npm run deploy:backend   # Deploy to Railway
```

## Key Technologies

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js + React | 14+ |
| Backend | NestJS | 10+ |
| Database | PostgreSQL | 14+ |
| Auth | Supabase Auth | Native |
| Storage | Supabase Storage | Native |
| CSS | Tailwind CSS | 3+ |
| UI Components | Shadcn/UI | Latest |
| ORM | Supabase Client | Latest |
| Payment | Razorpay | API v2 |
| Email | SendGrid | API v3 |

---

## Code Templates

### Create a New Module (Backend)

```bash
# 1. Create module directory
mkdir -p backend/src/modules/new-module/{controllers,services,dto,entities}

# 2. Create files
# entities/new-module.entity.ts
# dto/create-new-module.dto.ts
# new-module.service.ts
# new-module.controller.ts
# new-module.module.ts

# 3. Register in app.module.ts
imports: [
  // ...
  NewModuleModule,
]
```

### Create a New Page (Frontend)

```bash
# 1. Create route
mkdir -p frontend/src/app/dashboard/new-feature

# 2. Create files
# page.tsx - Main page component
# layout.tsx - Layout (optional)
# [id]/page.tsx - Detail page (optional)
```

### Service Template (Backend)

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@/shared/database/supabase.service';
import { CreateNewModuleDto } from './dto/create-new-module.dto';

@Injectable()
export class NewModuleService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateNewModuleDto) {
    // Validate
    if (!dto.name) throw new BadRequestException('Name required');

    // Create
    const { data, error } = await this.supabase
      .from('new_module_table')
      .insert([dto])
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(limit = 10, offset = 0) {
    const { data, error } = await this.supabase
      .from('new_module_table')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('new_module_table')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: Partial<CreateNewModuleDto>) {
    const { data, error } = await this.supabase
      .from('new_module_table')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('new_module_table')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}
```

### Component Template (Frontend)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useNewModuleAPI } from '@/lib/api/new-module';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function NewModuleList() {
  const { getAll, loading, error } = useNewModuleAPI();
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const result = await getAll();
      setItems(result.data);
    } catch (err) {
      console.error('Failed to load items', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Module</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <h2 className="font-bold">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <Button className="mt-4">View Details</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### API Hook Template (Frontend)

```typescript
import { useState, useCallback } from 'react';
import { API_URL } from '@/lib/api/endpoints';
import { getToken } from '@/lib/auth';

export function useNewModuleAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/new-module`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/new-module`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) throw new Error('Failed to create');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAll, create, loading, error };
}
```

---

## Production Deployment Checklist

### Pre-Deployment (1 week before)

- [ ] Code review complete
- [ ] All tests passing
- [ ] Security audit done
- [ ] Performance tested (under load)
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Customer communication drafted
- [ ] Monitoring rules configured
- [ ] Incident response team briefed

### Deployment Day

- [ ] All team members online
- [ ] Maintenance window announced
- [ ] Database backups verified
- [ ] Feature flags ready (to disable if needed)
- [ ] Logs monitored in real-time
- [ ] Error rates tracked
- [ ] Performance metrics recorded
- [ ] Customer support alerted

### Post-Deployment (24-48 hours)

- [ ] No critical errors in logs
- [ ] Performance metrics normal
- [ ] Customer reports addressed
- [ ] Analytics updated
- [ ] Post-deployment tests run
- [ ] Team retrospective scheduled
- [ ] Documentation updated

### Rollback Plan

If critical issues arise:

```bash
# 1. Stop the deployment
# 2. Switch to previous version
git checkout previous-tag
npm run deploy

# 3. Restore database (if needed)
# 4. Notify customers
# 5. Post-mortem analysis
```

---

## Support & Resources

### Documentation
- [API Documentation](./docs/API.md)
- [Database Schema](./01_DATABASE_SCHEMA.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./04_IMPLEMENTATION_GUIDE.md)

### Community & Help
- GitHub Issues: For bugs and feature requests
- GitHub Discussions: For general questions
- Slack Channel: For team communication
- Weekly standups: Every Monday 10 AM IST

### Important Links
- Frontend Repo: `github.com/your-org/eden-nest-erp/frontend`
- Backend Repo: `github.com/your-org/eden-nest-erp/backend`
- Production Dashboard: `app.edennestfarm.com`
- API Status: `status.edennestfarm.com`
- Documentation: `docs.edennestfarm.com`

### Key Contacts
- Tech Lead: [Name]
- Product Owner: [Name]
- DevOps: [Name]
- Design Lead: [Name]

---

## Monitoring & Alerts

### Key Metrics to Monitor

```
Frontend (Vercel)
├─ Page load time (< 3s target)
├─ Error rate (< 0.1% target)
├─ Core Web Vitals
└─ User session errors

Backend (Railway)
├─ API response time (< 200ms target)
├─ Error rate (< 0.5% target)
├─ Database query time (< 500ms target)
├─ Memory usage (< 512MB target)
└─ CPU usage (< 60% target)

Database (Supabase)
├─ Connection pool usage
├─ Query performance
├─ Disk usage (< 400MB target)
└─ Backup status (daily)

Payment Gateway
├─ Transaction success rate (> 99%)
├─ Webhook delivery rate (> 99%)
└─ Reconciliation status
```

### Alert Rules

```
Critical
- API error rate > 5%
- Database unavailable
- Payment gateway down
- Data breach alert

High
- API response time > 1s
- Error rate > 1%
- Memory > 80%
- Disk usage > 80%

Medium
- Slow query (> 2s)
- Failed job processing
- Email delivery failures
```

---

## Frequently Used SQL Queries

```sql
-- Active customers count
SELECT COUNT(*) FROM customers WHERE status = 'active';

-- Today's revenue
SELECT SUM(amount) FROM payments 
WHERE status = 'captured' 
AND DATE(created_at) = CURRENT_DATE;

-- Monthly revenue
SELECT DATE_TRUNC('month', created_at), SUM(amount) 
FROM payments 
WHERE status = 'captured' 
GROUP BY DATE_TRUNC('month', created_at);

-- Pending orders
SELECT * FROM orders 
WHERE order_status IN ('pending', 'confirmed', 'packed')
ORDER BY created_at DESC;

-- Inventory items low on stock
SELECT * FROM inventory_items 
WHERE quantity_available < (SELECT avg(quantity_available) FROM inventory_items) * 0.2
ORDER BY quantity_available ASC;

-- Subscription churn rate
SELECT 
  MONTH(created_at) as month,
  COUNT(*) as created,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
  ROUND(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as churn_rate
FROM subscriptions
GROUP BY MONTH(created_at);

-- Customer lifetime value
SELECT 
  customer_id,
  COUNT(DISTINCT order_id) as total_orders,
  SUM(total) as lifetime_value,
  ROUND(AVG(total), 2) as avg_order_value,
  DATEDIFF(MAX(created_at), MIN(created_at)) as days_active
FROM orders
WHERE payment_status = 'paid'
GROUP BY customer_id
ORDER BY lifetime_value DESC;

-- Top selling products
SELECT 
  p.name,
  SUM(oi.quantity) as units_sold,
  SUM(oi.line_total) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 10;

-- Delivery performance by driver
SELECT 
  u.full_name,
  COUNT(*) as total_deliveries,
  SUM(CASE WHEN d.status = 'delivered' THEN 1 ELSE 0 END) as successful,
  ROUND(SUM(CASE WHEN d.status = 'delivered' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM deliveries d
JOIN users u ON d.driver_id = u.id
GROUP BY u.id, u.full_name
ORDER BY success_rate DESC;
```

---

## Troubleshooting Guide

### Common Issues & Solutions

**Issue**: JWT token expired
```
Solution: Refresh token using /auth/refresh endpoint
Code: const newToken = await fetch('/auth/refresh', { ... })
```

**Issue**: Supabase connection refused
```
Solution: Check DATABASE_URL environment variable
Debug: psql $DATABASE_URL -c "SELECT 1"
```

**Issue**: Payment webhook not received
```
Solution: Check webhook URL in payment gateway dashboard
Verify: Payment gateway logs show delivery status
Resend: Manual webhook resend if needed
```

**Issue**: Inventory sync issue
```
Solution: Check transaction logs for incomplete operations
Fix: Run inventory reconciliation job
Verify: Compare with physical count
```

**Issue**: High API latency
```
Solution: Check database query performance
Debug: Enable query logging
Optimize: Add indexes or cache frequently accessed data
```

---

This quick reference guide should be printed and posted in the team workspace!
