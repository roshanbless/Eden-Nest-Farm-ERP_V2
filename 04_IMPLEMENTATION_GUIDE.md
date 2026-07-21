# Eden Nest Farm ERP - Complete Implementation Guide

---

# PHASE 1: MVP DEVELOPMENT (Weeks 1-12)

## Sprint 0: Infrastructure Setup (Week 1)

### GitHub Setup

```bash
# 1. Create GitHub repository
gh repo create eden-nest-erp --public --source=. --remote=origin --push

# 2. Create main branches
git branch main develop
git push origin develop

# 3. Create branch protection rules
# Settings > Branches > Add rule
# - Require pull request reviews: 1
# - Require status checks to pass
# - Require conversation resolution before merging

# 4. Set up environments
# Settings > Environments > Production/Staging/Development
```

### Supabase Project Setup

```bash
# 1. Create Supabase project
# Go to https://supabase.com/dashboard
# New project > eden-nest-farm-prod

# 2. Get credentials
# Copy: API URL, Anon Key, Service Role Key

# 3. Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Backend
DATABASE_URL=postgresql://postgres:PASSWORD@host:5432/postgres
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=3600

# Payment Gateway (optional for MVP)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Email Service
SENDGRID_API_KEY=SG.xxx

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
EOF

# 4. Initialize database schema
psql -d postgresql://user:password@host:5432/postgres < database/schema.sql
```

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/eden-nest-erp.git
cd eden-nest-erp

# Install dependencies
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# Create database locally (optional)
docker-compose up -d postgres

# Start development servers
# Terminal 1: Frontend
cd frontend && npm run dev
# → http://localhost:3000

# Terminal 2: Backend
cd backend && npm run start:dev
# → http://localhost:3001

# Terminal 3: Database GUI (optional)
# docker run -p 5050:5050 dpage/pgadmin4
# → http://localhost:5050
```

---

## Sprint 1-2: Authentication & Core Setup (Weeks 2-3)

### Frontend - Authentication UI

```typescript
// frontend/src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Store tokens
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### Backend - JWT Strategy

```typescript
// backend/src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

---

## Sprint 3-4: Farm & Production Modules (Weeks 4-5)

### Frontend - Dashboard

```typescript
// frontend/src/app/dashboard/page.tsx
'use client';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import { useAuth } from '@/lib/hooks/useAuth';
import { Redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Redirect href="/auth/login" />;

  return <ExecutiveDashboard />;
}
```

### Backend - Production Service

```typescript
// backend/src/modules/production/production.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@/shared/database/supabase.service';
import { CreateProductionDto } from './dto/create-production.dto';

@Injectable()
export class ProductionService {
  constructor(private supabase: SupabaseService) {}

  async createDailyEntry(farmId: string, dto: CreateProductionDto) {
    const { data, error } = await this.supabase
      .from('production')
      .insert([
        {
          farm_id: farmId,
          date: dto.date,
          bird_count: dto.bird_count,
          eggs_produced: dto.eggs_produced,
          production_percentage: (dto.eggs_produced / (dto.bird_count * 0.99)) * 100,
          created_at: new Date(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProductionTrend(farmId: string, days: number = 30) {
    const { data, error } = await this.supabase
      .from('production')
      .select('date, eggs_produced, production_percentage')
      .eq('farm_id', farmId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }
}
```

---

## Sprint 5-6: Order Management (Weeks 6-7)

### Frontend - Order Form

```typescript
// frontend/src/components/orders/OrderForm.tsx
'use client';
import { useState } from 'react';
import { useOrdersAPI } from '@/lib/api/orders';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Table from '@/components/common/Table';

export default function OrderForm() {
  const { createOrder, loading } = useOrdersAPI();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const handleAddItem = (productId: string, quantity: number, price: number) => {
    setItems([...items, { productId, quantity, price, lineTotal: quantity * price }]);
  };

  const handleSubmit = async () => {
    const response = await createOrder({
      customer_id: customerId,
      items,
      total: items.reduce((sum, item) => sum + item.lineTotal, 0),
    });

    if (response.success) {
      alert(`Order created: ${response.data.order_number}`);
    }
  };

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <div className="space-y-4">
      <Select value={customerId} onChange={setCustomerId} placeholder="Select Customer" />
      
      <Table
        data={items}
        columns={[
          { header: 'Product', accessor: 'productId' },
          { header: 'Quantity', accessor: 'quantity' },
          { header: 'Price', accessor: 'price' },
          { header: 'Total', accessor: 'lineTotal' },
        ]}
      />

      <div className="text-lg font-bold">Total: ₹{total.toFixed(2)}</div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create Order'}
      </Button>
    </div>
  );
}
```

### Backend - Order Workflow

```typescript
// backend/src/modules/orders/services/order-workflow.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@/shared/database/supabase.service';

@Injectable()
export class OrderWorkflowService {
  constructor(private supabase: SupabaseService) {}

  async updateOrderStatus(orderId: string, newStatus: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ order_status: newStatus, updated_at: new Date() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Log status change for audit
    await this.supabase.from('order_history').insert([
      {
        order_id: orderId,
        status_to: newStatus,
        changed_at: new Date(),
      },
    ]);

    return data;
  }

  async getOrderTimeline(orderId: string) {
    const { data, error } = await this.supabase
      .from('order_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
}
```

---

## Sprint 7-8: Subscription Module (Weeks 8-9)

### Frontend - Subscription Manager

```typescript
// frontend/src/components/subscriptions/SubscriptionForm.tsx
'use client';
import { useState } from 'react';
import { useSubscriptionsAPI } from '@/lib/api/subscriptions';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import DatePicker from '@/components/common/DatePicker';

export default function SubscriptionForm({ customerId }: { customerId: string }) {
  const { createSubscription, loading } = useSubscriptionsAPI();
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date());

  const handleSubmit = async () => {
    const result = await createSubscription({
      customer_id: customerId,
      plan_id: planId,
      start_date: startDate.toISOString().split('T')[0],
      auto_renew: true,
    });

    if (result.success) {
      alert(`Subscription created: ${result.data.subscription_number}`);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      <h2 className="text-lg font-bold">Create Subscription</h2>

      <Select value={planId} onChange={setPlanId} placeholder="Select Plan">
        <option value="weekly">Weekly Delivery</option>
        <option value="biweekly">Bi-weekly Delivery</option>
        <option value="monthly">Monthly Delivery</option>
      </Select>

      <DatePicker
        value={startDate}
        onChange={setStartDate}
        label="Start Date"
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create Subscription'}
      </Button>
    </div>
  );
}
```

### Backend - Billing Cycle Job

```typescript
// backend/src/jobs/subscriptions/billing-cycle.job.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseService } from '@/shared/database/supabase.service';
import { OrdersService } from '@/modules/orders/orders.service';

@Injectable()
export class BillingCycleJob {
  constructor(
    private supabase: SupabaseService,
    private ordersService: OrdersService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processDueSubscriptions() {
    // Find subscriptions where next_billing_date = today
    const { data: subscriptions, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .eq('next_billing_date', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('Subscription billing error:', error);
      return;
    }

    for (const sub of subscriptions) {
      // Create order from subscription
      const orderData = {
        customer_id: sub.customer_id,
        order_type: 'subscription',
        total: sub.amount,
        // ... other fields
      };

      await this.ordersService.create(orderData);

      // Update next_billing_date
      await this.supabase
        .from('subscriptions')
        .update({
          next_billing_date: this.getNextBillingDate(sub.frequency),
          renewal_count: sub.renewal_count + 1,
        })
        .eq('id', sub.id);
    }
  }

  private getNextBillingDate(frequency: string): string {
    const nextDate = new Date();
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }
    return nextDate.toISOString().split('T')[0];
  }
}
```

---

## Sprint 9-10: Delivery & Logistics (Weeks 10-11)

### Frontend - Delivery Dispatch

```typescript
// frontend/src/components/deliveries/DispatchBoard.tsx
'use client';
import { useState, useEffect } from 'react';
import { useDeliveriesAPI } from '@/lib/api/deliveries';
import MapComponent from '@/components/deliveries/DeliveryMap';
import Table from '@/components/common/Table';

export default function DispatchBoard() {
  const { getDeliveries, assignDriver } = useDeliveriesAPI();
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    const result = await getDeliveries({ status: 'pending' });
    setDeliveries(result.data);
  };

  const handleAssignDriver = async (deliveryId: string, driverId: string) => {
    await assignDriver(deliveryId, driverId);
    loadDeliveries();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <MapComponent deliveries={deliveries} selectedDelivery={selectedDelivery} />
      </div>
      <div>
        <Table
          data={deliveries}
          columns={[
            { header: 'Order', accessor: 'order_number' },
            { header: 'Customer', accessor: 'customer_name' },
            { header: 'Zone', accessor: 'delivery_zone' },
            { header: 'Status', accessor: 'status' },
          ]}
          onRowClick={(row) => setSelectedDelivery(row)}
        />
      </div>
    </div>
  );
}
```

---

## Sprint 11-12: Analytics & Reporting (Weeks 12)

### Backend - Analytics Service

```typescript
// backend/src/modules/analytics/services/kpi-calculation.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@/shared/database/supabase.service';

@Injectable()
export class KPICalculationService {
  constructor(private supabase: SupabaseService) {}

  async calculateDailyKPIs(date: string) {
    // Revenue KPIs
    const { data: orders } = await this.supabase
      .from('payments')
      .select('amount')
      .eq('status', 'captured')
      .eq('date', date);

    const todayRevenue = orders?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Customer KPIs
    const { data: newCustomers } = await this.supabase
      .from('customers')
      .select('id')
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`);

    // Production KPIs
    const { data: production } = await this.supabase
      .from('production')
      .select('eggs_produced')
      .eq('date', date);

    const totalProduction = production?.reduce((sum, p) => sum + p.eggs_produced, 0) || 0;

    // Delivery KPIs
    const { data: deliveries } = await this.supabase
      .from('deliveries')
      .select('status')
      .eq('scheduled_date', date);

    const completedDeliveries = deliveries?.filter((d) => d.status === 'delivered').length || 0;
    const failedDeliveries = deliveries?.filter((d) => d.status === 'failed').length || 0;

    return {
      date,
      today_revenue: todayRevenue,
      new_customers: newCustomers?.length || 0,
      total_production: totalProduction,
      completed_deliveries: completedDeliveries,
      failed_deliveries: failedDeliveries,
      delivery_success_rate: (completedDeliveries / (deliveries?.length || 1)) * 100,
    };
  }

  async getMonthlyRevenue(month: string) {
    const { data: payments } = await this.supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'captured')
      .gte('created_at', `${month}-01T00:00:00`)
      .lt('created_at', `${month}-31T23:59:59`);

    return payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  }

  async getCustomerRetention(days: number = 30) {
    const { data: customers } = await this.supabase
      .from('customers')
      .select('id, created_at, last_purchase_date')
      .lt('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    const retained = customers?.filter((c) => c.last_purchase_date !== null).length || 0;
    return (retained / (customers?.length || 1)) * 100;
  }
}
```

---

# DEPLOYMENT GUIDE

## Free Tier Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Setup                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (Vercel - Free Tier)                               │
│  ├─ Next.js application                                      │
│  ├─ Automatic CI/CD from GitHub                              │
│  ├─ 100GB/month bandwidth                                    │
│  └─ $0/month                                                 │
│                                                               │
│  Backend (Railway - Free Tier $5/month)                      │
│  ├─ NestJS REST API                                          │
│  ├─ Node.js runtime                                          │
│  └─ Auto-deploy from GitHub                                  │
│                                                               │
│  Database (Supabase - Free Tier)                             │
│  ├─ PostgreSQL 500MB                                         │
│  ├─ Row-Level Security enabled                               │
│  ├─ Real-time subscriptions                                  │
│  └─ $0/month                                                 │
│                                                               │
│  Authentication (Supabase Auth)                              │
│  ├─ JWT tokens                                               │
│  ├─ OAuth2 (optional)                                        │
│  └─ Included in Supabase                                     │
│                                                               │
│  Object Storage (Supabase)                                   │
│  ├─ Invoice PDFs                                             │
│  ├─ Driver signatures                                        │
│  ├─ 1GB free storage                                         │
│  └─ S3-compatible API                                        │
│                                                               │
│  Email Service (SendGrid - Free Tier)                        │
│  ├─ 100 emails/day                                           │
│  ├─ Transactional emails                                     │
│  └─ $0/month                                                 │
│                                                               │
│  Payment Gateway (Razorpay)                                  │
│  ├─ 0% setup fee                                             │
│  ├─ 1.9% + ₹15 per transaction                               │
│  └─ Test mode available                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Total Cost: $0-5/month (MVP)
```

## Deployment Steps

### 1. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Link to GitHub for automatic deployments
# Settings > Git Integrations > Connect Repository

# Environment Variables (in Vercel dashboard)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### 2. Deploy Backend to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Link GitHub repository
railway link

# Add environment variables
railway variable add DATABASE_URL "postgresql://..."
railway variable add JWT_SECRET "your-secret"

# Deploy
railway up

# Get deployment URL
railway open
```

### 3. Database Migrations

```bash
# Create Supabase project
# Settings > Database > Connection String > Copy

# Run migrations
psql postgresql://postgres:password@host:5432/postgres < database/migrations/001_init_schema.sql

# Verify tables
psql -c "\dt" postgresql://postgres:password@host:5432/postgres
```

### 4. Environment Configuration

```bash
# .env.production (Vercel frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/v1

# Railway backend environment
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=super-secret-key-min-32-chars-long
JWT_EXPIRY=3600
NODE_ENV=production
PORT=3000

# Optional
RAZORPAY_KEY_ID=rzp_live_xxx
SENDGRID_API_KEY=SG.xxx
```

---

# PRODUCTION CODING STANDARDS

## TypeScript Strict Mode

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBind OptionCallbacks": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Code Organization

```typescript
// ✅ GOOD: Clear separation of concerns
// backend/src/modules/orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    // Validate input
    this.validateOrderData(dto);

    // Create order
    const { data, error } = await this.supabase
      .from('orders')
      .insert([this.mapDtoToEntity(dto)])
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    // Trigger side effects (send email, create billing cycle, etc.)
    await this.notificationService.sendOrderConfirmation(data);

    return data;
  }

  private validateOrderData(dto: CreateOrderDto): void {
    if (!dto.customer_id) throw new BadRequestException('Customer ID required');
    if (!dto.items || dto.items.length === 0) throw new BadRequestException('Items required');
    if (dto.items.some((item) => item.quantity <= 0)) {
      throw new BadRequestException('Invalid quantity');
    }
  }

  private mapDtoToEntity(dto: CreateOrderDto): any {
    return {
      customer_id: dto.customer_id,
      total: dto.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
      order_status: 'pending',
      payment_status: 'pending',
      created_at: new Date(),
    };
  }
}

// ❌ WRONG: Mixed concerns, no validation
export class OrdersService {
  async create(dto: any) {
    // Direct insert without validation
    const { data } = await db.insert(dto);
    // Email sent without checking if order was created
    sendEmail(data.customer_email, 'Order created');
    return data;
  }
}
```

## Error Handling

```typescript
// ✅ GOOD: Custom exception handling
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message = 'Internal server error';
    let details: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof Error) {
      message = exception.message;
      // Log for debugging
      console.error('Unhandled error:', exception);
    }

    response.status(status).json({
      success: false,
      error: {
        code: `${status}_ERROR`,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.id,
      },
    });
  }
}

// ❌ WRONG: Unhandled errors leak to client
app.get('/orders', (req, res) => {
  const orders = db.query("SELECT * FROM orders WHERE id = " + req.params.id); // SQL injection!
  res.json(orders); // Error if query fails, no error handling
});
```

## Validation

```typescript
// ✅ GOOD: Comprehensive DTO validation
import { IsEmail, IsNotEmpty, IsPositive, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  customer_id: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsDateString()
  scheduled_delivery_date: string;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  discount: number = 0;
}

export class OrderItemDto {
  @IsUUID()
  product_id: string;

  @IsPositive()
  @IsInt()
  quantity: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  unit_price: number;
}

// Apply in controller
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body(new ValidationPipe()) dto: CreateOrderDto) {
  return this.ordersService.create(dto);
}

// ❌ WRONG: No validation, vulnerable to bad data
@Post()
create(@Body() dto: any) {
  // Any data accepted, could cause database errors
  return this.ordersService.create(dto);
}
```

## Security Best Practices

```typescript
// ✅ GOOD: Secure password handling
import * as bcrypt from 'bcrypt';

export class AuthService {
  async register(dto: RegisterDto) {
    // Check if user exists
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user with hashed password
    const user = await this.usersService.create({
      email: dto.email,
      password_hash: hashedPassword, // NEVER store plaintext
      full_name: dto.full_name,
    });

    return { user_id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Compare with hashed password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // Generate JWT
    const token = this.jwtService.sign(
      { sub: user.id, role: user.role },
      { expiresIn: '1h' },
    );

    return { access_token: token, expires_in: 3600 };
  }
}

// ✅ GOOD: Rate limiting
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
  ],
})
export class AppModule {}

@UseGuards(ThrottlerGuard)
@Post('/login')
login(@Body() dto: LoginDto) {
  return this.authService.login(dto.email, dto.password);
}

// ✅ GOOD: Input sanitization
import * as sanitize from 'sanitize-html';

const cleanedInput = sanitize(userInput, {
  allowedTags: [],
  allowedAttributes: {},
});

// ❌ WRONG: Storing plaintext passwords
password: dto.password // NEVER DO THIS

// ❌ WRONG: SQL injection vulnerability
db.query(`SELECT * FROM users WHERE email = '${email}'`)

// ❌ WRONG: No rate limiting
@Post('/login')
login(@Body() dto: LoginDto) {
  // Can be brute-forced
}
```

## Testing

```typescript
// ✅ GOOD: Comprehensive test suite
describe('OrdersService', () => {
  let service: OrdersService;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { order_id: '123', status: 'pending' },
              error: null,
            }),
          }),
        }),
      }),
    };

    service = new OrdersService(mockSupabase);
  });

  test('should create order successfully', async () => {
    const dto: CreateOrderDto = {
      customer_id: 'cust-123',
      items: [{ product_id: 'prod-123', quantity: 1, unit_price: 100 }],
      scheduled_delivery_date: '2024-01-16',
    };

    const result = await service.create(dto);

    expect(result.order_id).toBe('123');
    expect(result.status).toBe('pending');
  });

  test('should throw error if customer not found', async () => {
    mockSupabase.from().insert().select().single.mockResolvedValueOnce({
      data: null,
      error: { message: 'Customer not found' },
    });

    const dto: CreateOrderDto = {
      customer_id: 'invalid-id',
      items: [],
      scheduled_delivery_date: '2024-01-16',
    };

    await expect(service.create(dto)).rejects.toThrow();
  });
});
```

## Frontend Best Practices

```typescript
// ✅ GOOD: Proper component structure
// frontend/src/components/orders/OrderForm.tsx
'use client';
import { useState, useCallback } from 'react';
import { useOrdersAPI } from '@/lib/api/orders';
import { useNotification } from '@/lib/hooks/useNotification';
import Button from '@/components/common/Button';

interface OrderFormProps {
  customerId: string;
  onSuccess?: (order: Order) => void;
}

export default function OrderForm({ customerId, onSuccess }: OrderFormProps) {
  const { createOrder, loading, error } = useOrdersAPI();
  const { showNotification } = useNotification();
  const [items, setItems] = useState<OrderItem[]>([]);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await createOrder({
        customer_id: customerId,
        items,
        total: calculateTotal(items),
      });

      if (response.success) {
        showNotification('Order created successfully', 'success');
        onSuccess?.(response.data);
      }
    } catch (err) {
      showNotification('Failed to create order', 'error');
    }
  }, [customerId, items, createOrder, showNotification, onSuccess]);

  const calculateTotal = (items: OrderItem[]) =>
    items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
      {/* Form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Order'}
      </Button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}

// ✅ GOOD: API error handling
// frontend/src/lib/api/orders.ts
export function useOrdersAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (dto: CreateOrderDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Failed to create order');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOrder, loading, error };
}

// ❌ WRONG: No error handling, hardcoded API URL
export function useOrders() {
  const [orders, setOrders] = useState([]);

  const create = (dto) => {
    fetch('http://localhost:3001/orders', {
      method: 'POST',
      body: JSON.stringify(dto),
    }).then((res) => setOrders([...orders, res])); // No error handling!
  };

  return { create, orders };
}
```

---

## Git Workflow

```bash
# 1. Create feature branch from develop
git checkout -b feature/order-management develop

# 2. Commit with clear messages
git add .
git commit -m "feat: add order creation endpoint with validation"

# 3. Keep commits atomic
# Good: "feat: add customer validation", "feat: add order total calculation"
# Bad: "fix: everything related to orders"

# 4. Push and create pull request
git push origin feature/order-management

# 5. Pull request should include:
# - Description of changes
# - Testing done
# - Screenshots for UI changes

# 6. After approval, merge to develop
git checkout develop
git pull origin develop
git merge --no-ff feature/order-management
git push origin develop

# 7. Create release from develop
git checkout -b release/v1.0.0 develop
# Update version numbers
git push origin release/v1.0.0

# 8. After testing, merge to main
git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 9. Merge back to develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop
```

## Documentation Standards

Every module should include:

```markdown
# Module Name

## Overview
What this module does and why it exists.

## Features
- Feature 1
- Feature 2
- Feature 3

## API Endpoints
### GET /resource
Description

### POST /resource
Description

## Database Tables
- table_name

## Dependencies
- Service A
- Service B

## Configuration
Environment variables needed

## Usage Examples
```typescript
// Code examples
```

## Error Handling
Common errors and solutions

## Testing
How to test this module

## Future Improvements
- Improvement 1
- Improvement 2
```

---

# PERFORMANCE OPTIMIZATION

## Frontend Performance

```typescript
// Use React.memo for expensive components
import { memo } from 'react';

const OrderCard = memo(({ order }: { order: Order }) => {
  return <div>{order.order_number}</div>;
});

// Use useMemo for expensive calculations
import { useMemo } from 'react';

function OrderSummary({ items }: { items: OrderItem[] }) {
  const total = useMemo(() =>
    items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0),
    [items],
  );

  return <div>Total: ₹{total}</div>;
}

// Lazy load components
import dynamic from 'next/dynamic';

const AnalyticsDashboard = dynamic(() => import('@/components/dashboard/Analytics'), {
  loading: () => <p>Loading...</p>,
});
```

## Backend Performance

```typescript
// Database query optimization
@Injectable()
export class OrdersService {
  async getOrdersWithCustomer(limit: number = 10) {
    // Use select to limit columns
    const { data } = await this.supabase
      .from('orders')
      .select(`
        order_id,
        order_number,
        total,
        order_status,
        customers(full_name, email)  // Join with customers
      `)
      .limit(limit);

    return data;
  }

  // Batch operations for bulk inserts
  async createBillingCycles(subscriptions: Subscription[]) {
    const cycles = subscriptions.map((sub) => ({
      subscription_id: sub.id,
      cycle_start_date: new Date(),
      cycle_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      amount: sub.amount,
      payment_status: 'pending',
    }));

    const { data } = await this.supabase
      .from('subscription_billing_cycles')
      .insert(cycles); // Single query for all cycles

    return data;
  }
}
```

---

This comprehensive guide covers everything needed to build and deploy the Eden Nest Farm ERP MVP.
