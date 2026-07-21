# Eden Nest Farm ERP - REST API Design

**Base URL**: `https://api.edennestfarm.com/v1`  
**Authentication**: Bearer JWT Token  
**Content-Type**: `application/json`

---

## Response Format Standard

### Success Response (2xx)

```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Farm with ID xxx not found",
    "details": {
      "field": "farm_id",
      "value": "xxx"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_xxx"
  }
}
```

---

## Authentication Endpoints

### POST /auth/register
Create new user account

```bash
curl -X POST https://api.edennestfarm.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "John Doe",
    "phone": "+91-9876543210",
    "role": "customer"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "customer",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### POST /auth/login
Authenticate user and get JWT token

```bash
curl -X POST https://api.edennestfarm.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 3600,
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer"
    }
  }
}
```

### POST /auth/refresh
Refresh access token

```bash
curl -X POST https://api.edennestfarm.com/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### POST /auth/logout
Invalidate tokens

```bash
curl -X POST https://api.edennestfarm.com/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Farm Management Endpoints

### GET /farms
List all farms (paginated)

```bash
curl -X GET "https://api.edennestfarm.com/v1/farms?page=1&limit=10&status=active" \
  -H "Authorization: Bearer TOKEN"
```

**Query Parameters**:
- `page` (int): Page number, default 1
- `limit` (int): Items per page, default 10
- `status` (string): Filter by status (active, inactive)
- `sort` (string): Sort field, default "created_at"
- `order` (string): Sort order (asc, desc)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "farm_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Eden Nest Farm A",
      "location": "Kerala, India",
      "owner_id": "550e8400-e29b-41d4-a716-446655440001",
      "manager_id": "550e8400-e29b-41d4-a716-446655440002",
      "total_bird_count": 5000,
      "production_capacity_daily": 4500.50,
      "is_active": true,
      "created_at": "2024-01-10T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "total_pages": 1
    }
  }
}
```

### GET /farms/:farmId
Get farm details

```bash
curl -X GET https://api.edennestfarm.com/v1/farms/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN"
```

### POST /farms
Create new farm (Super Admin, Farm Owner only)

```bash
curl -X POST https://api.edennestfarm.com/v1/farms \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eden Nest Farm B",
    "location": "Tamil Nadu, India",
    "owner_id": "550e8400-e29b-41d4-a716-446655440001",
    "total_bird_count": 6000,
    "production_capacity_daily": 5400.00
  }'
```

### PUT /farms/:farmId
Update farm details

```bash
curl -X PUT https://api.edennestfarm.com/v1/farms/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "production_capacity_daily": 5500.00,
    "manager_id": "550e8400-e29b-41d4-a716-446655440003"
  }'
```

### GET /farms/:farmId/units
List farm units (sheds, equipment)

```bash
curl -X GET https://api.edennestfarm.com/v1/farms/550e8400-e29b-41d4-a716-446655440000/units \
  -H "Authorization: Bearer TOKEN"
```

### POST /farms/:farmId/units
Create farm unit

```bash
curl -X POST https://api.edennestfarm.com/v1/farms/550e8400-e29b-41d4-a716-446655440000/units \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shed A",
    "unit_type": "shed",
    "capacity": 1200,
    "equipment": {
      "cooling_system": "evaporative",
      "capacity_liters": 5000
    }
  }'
```

---

## Production Endpoints

### GET /production
Get production logs (with filters)

```bash
curl -X GET "https://api.edennestfarm.com/v1/production?farm_id=xxx&date_from=2024-01-01&date_to=2024-01-31" \
  -H "Authorization: Bearer TOKEN"
```

### POST /production/daily-entry
Create daily production entry

```bash
curl -X POST https://api.edennestfarm.com/v1/production/daily-entry \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-01-15",
    "bird_count": 5000,
    "feed_consumed_kg": 250.50,
    "mortality_count": 2,
    "eggs_produced": 4850,
    "broken_eggs": 50,
    "grade_a": 2500,
    "grade_b": 1800,
    "grade_c": 550,
    "production_percentage": 97.00,
    "quality_score": 8.5,
    "notes": "All birds healthy, excellent production day"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "production_id": "550e8400-e29b-41d4-a716-446655440000",
    "farm_id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-01-15",
    "eggs_produced": 4850,
    "production_percentage": 97.00,
    "quality_score": 8.5,
    "recorded_by": "550e8400-e29b-41d4-a716-446655440002",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### GET /production/analytics
Production analytics and KPIs

```bash
curl -X GET "https://api.edennestfarm.com/v1/production/analytics?farm_id=xxx&period=30days" \
  -H "Authorization: Bearer TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total_eggs_produced": 145500,
    "average_daily_production": 4850,
    "production_trend": "up",
    "quality_average": 8.4,
    "waste_percentage": 1.03,
    "feed_efficiency": 0.195,
    "charts": {
      "daily_production": [...],
      "grade_distribution": {...},
      "quality_trend": [...]
    }
  }
}
```

---

## Inventory Endpoints

### GET /inventory
Get inventory items (with filtering)

```bash
curl -X GET "https://api.edennestfarm.com/v1/inventory?farm_id=xxx&product_id=xxx&status=low_stock" \
  -H "Authorization: Bearer TOKEN"
```

### POST /inventory/stock-in
Add inventory (receiving goods)

```bash
curl -X POST https://api.edennestfarm.com/v1/inventory/stock-in \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": "550e8400-e29b-41d4-a716-446655440000",
    "batch_id": "550e8400-e29b-41d4-a716-446655440000",
    "quantity": 1000,
    "warehouse_location": "Rack A-1",
    "reference_type": "production",
    "reference_id": "550e8400-e29b-41d4-a716-446655440000",
    "notes": "Fresh batch from production"
  }'
```

### POST /inventory/stock-out
Remove inventory (dispatch, waste)

```bash
curl -X POST https://api.edennestfarm.com/v1/inventory/stock-out \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "550e8400-e29b-41d4-a716-446655440000",
    "quantity": 50,
    "transaction_type": "waste",
    "reason": "Broken during handling",
    "reference_type": "order",
    "reference_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### GET /inventory/expiry-alerts
Items nearing expiration

```bash
curl -X GET "https://api.edennestfarm.com/v1/inventory/expiry-alerts?days_until=7" \
  -H "Authorization: Bearer TOKEN"
```

---

## Customer Endpoints

### GET /customers
List customers (CRM)

```bash
curl -X GET "https://api.edennestfarm.com/v1/customers?segment=premium&status=active&page=1" \
  -H "Authorization: Bearer TOKEN"
```

### POST /customers
Create new customer

```bash
curl -X POST https://api.edennestfarm.com/v1/customers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "customer_type": "retail",
    "segment": "standard",
    "preferences": {
      "communication": "email",
      "frequency": "weekly",
      "special_requests": "Organic only"
    }
  }'
```

### GET /customers/:customerId
Get customer details with LTV

```bash
curl -X GET https://api.edennestfarm.com/v1/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "customer_type": "retail",
    "segment": "premium",
    "total_purchases": 25000.00,
    "total_orders": 45,
    "lifetime_value": 25000.00,
    "last_purchase_date": "2024-01-14",
    "status": "active",
    "addresses": [
      {
        "address_id": "550e8400-e29b-41d4-a716-446655440000",
        "address_type": "delivery",
        "street_address": "123 Main St",
        "city": "Kochi",
        "state_province": "Kerala",
        "postal_code": "682001",
        "is_primary": true
      }
    ],
    "preferences": {
      "communication": "email",
      "frequency": "weekly"
    }
  }
}
```

### PUT /customers/:customerId
Update customer profile

```bash
curl -X PUT https://api.edennestfarm.com/v1/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "segment": "vip",
    "preferences": {
      "communication": "whatsapp",
      "frequency": "twice_weekly"
    }
  }'
```

### GET /customers/:customerId/analytics
Customer analytics (churn risk, LTV, etc.)

```bash
curl -X GET https://api.edennestfarm.com/v1/customers/550e8400-e29b-41d4-a716-446655440000/analytics \
  -H "Authorization: Bearer TOKEN"
```

---

## Product Endpoints

### GET /products
List products (catalog)

```bash
curl -X GET "https://api.edennestfarm.com/v1/products?category=eggs_dozen&page=1" \
  -H "Authorization: Bearer TOKEN"
```

### POST /products
Create product (Admin only)

```bash
curl -X POST https://api.edennestfarm.com/v1/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Farm Eggs - Dozen",
    "sku": "ORG-EGGS-12",
    "description": "Fresh organic eggs from free-range hens",
    "category": "eggs_dozen",
    "unit_of_measure": "dozen",
    "base_price": 150.00,
    "weight_grams": 650
  }'
```

### POST /products/:productId/pricing
Set channel-specific pricing

```bash
curl -X POST https://api.edennestfarm.com/v1/products/550e8400-e29b-41d4-a716-446655440000/pricing \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "subscription",
    "base_price": 130.00,
    "discount_percentage": 13.33,
    "effective_from": "2024-01-15",
    "effective_to": "2024-03-31"
  }'
```

---

## Order Endpoints

### GET /orders
Get orders with filtering

```bash
curl -X GET "https://api.edennestfarm.com/v1/orders?status=pending&date_from=2024-01-01&date_to=2024-01-31&page=1" \
  -H "Authorization: Bearer TOKEN"
```

### POST /orders
Create order (Order entry via website, app, sales team)

```bash
curl -X POST https://api.edennestfarm.com/v1/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "order_type": "one_time",
    "source": "website",
    "delivery_address_id": "550e8400-e29b-41d4-a716-446655440000",
    "scheduled_delivery_date": "2024-01-16",
    "items": [
      {
        "product_id": "550e8400-e29b-41d4-a716-446655440000",
        "quantity": 3,
        "unit_price": 150.00
      }
    ],
    "discount": 0,
    "notes": "Deliver after 6 PM"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "order_number": "ORD-2024-00001",
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "order_status": "confirmed",
    "payment_status": "pending",
    "total": 450.00,
    "items": [
      {
        "product_id": "550e8400-e29b-41d4-a716-446655440000",
        "quantity": 3,
        "unit_price": 150.00,
        "line_total": 450.00
      }
    ],
    "scheduled_delivery_date": "2024-01-16",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /orders/:orderId/status
Update order status

```bash
curl -X PUT https://api.edennestfarm.com/v1/orders/550e8400-e29b-41d4-a716-446655440000/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_status": "packed",
    "notes": "Ready for delivery"
  }'
```

### GET /orders/:orderId/invoice
Get order invoice

```bash
curl -X GET https://api.edennestfarm.com/v1/orders/550e8400-e29b-41d4-a716-446655440000/invoice \
  -H "Authorization: Bearer TOKEN"
```

---

## Subscription Endpoints

### GET /subscriptions
List subscriptions

```bash
curl -X GET "https://api.edennestfarm.com/v1/subscriptions?status=active&customer_id=xxx" \
  -H "Authorization: Bearer TOKEN"
```

### POST /subscriptions
Create subscription

```bash
curl -X POST https://api.edennestfarm.com/v1/subscriptions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "plan_id": "550e8400-e29b-41d4-a716-446655440000",
    "start_date": "2024-01-15",
    "amount": 130.00,
    "frequency": "weekly",
    "auto_renew": true
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "subscription_id": "550e8400-e29b-41d4-a716-446655440000",
    "subscription_number": "SUB-2024-00001",
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "plan_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "amount": 130.00,
    "frequency": "weekly",
    "start_date": "2024-01-15",
    "next_billing_date": "2024-01-22",
    "auto_renew": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### POST /subscriptions/:subscriptionId/pause
Pause subscription

```bash
curl -X POST https://api.edennestfarm.com/v1/subscriptions/550e8400-e29b-41d4-a716-446655440000/pause \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pause_reason": "On vacation",
    "pause_start": "2024-01-20",
    "pause_end": "2024-02-03"
  }'
```

### POST /subscriptions/:subscriptionId/resume
Resume paused subscription

```bash
curl -X POST https://api.edennestfarm.com/v1/subscriptions/550e8400-e29b-41d4-a716-446655440000/resume \
  -H "Authorization: Bearer TOKEN"
```

### POST /subscriptions/:subscriptionId/cancel
Cancel subscription

```bash
curl -X POST https://api.edennestfarm.com/v1/subscriptions/550e8400-e29b-41d4-a716-446655440000/cancel \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Too expensive"
  }'
```

---

## Delivery Endpoints

### GET /deliveries
Get deliveries with filtering

```bash
curl -X GET "https://api.edennestfarm.com/v1/deliveries?status=pending&date=2024-01-15&zone_id=xxx" \
  -H "Authorization: Bearer TOKEN"
```

### POST /deliveries
Create delivery (dispatch order)

```bash
curl -X POST https://api.edennestfarm.com/v1/deliveries \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "driver_id": "550e8400-e29b-41d4-a716-446655440000",
    "delivery_zone_id": "550e8400-e29b-41d4-a716-446655440000",
    "scheduled_date": "2024-01-16",
    "estimated_delivery_time": "10:00 AM - 12:00 PM"
  }'
```

### PUT /deliveries/:deliveryId/tracking
Update delivery GPS tracking (Driver app)

```bash
curl -X PUT https://api.edennestfarm.com/v1/deliveries/550e8400-e29b-41d4-a716-446655440000/tracking \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 10.0326,
    "longitude": 76.3119,
    "status": "in_transit"
  }'
```

### POST /deliveries/:deliveryId/complete
Mark delivery as completed

```bash
curl -X POST https://api.edennestfarm.com/v1/deliveries/550e8400-e29b-41d4-a716-446655440000/complete \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_name": "Rajesh Kumar",
    "payment_method": "cash",
    "amount_collected": 450.00,
    "notes": "Customer satisfied"
  }'
```

### GET /deliveries/today-route/:driverId
Get today's delivery route (Driver app)

```bash
curl -X GET https://api.edennestfarm.com/v1/deliveries/today-route/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN"
```

---

## Payment Endpoints

### POST /payments/initiate
Initiate payment (webhook to payment gateway)

```bash
curl -X POST https://api.edennestfarm.com/v1/payments/initiate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 450.00,
    "currency": "INR",
    "payment_method": "credit_card",
    "customer_email": "rajesh@example.com",
    "customer_phone": "+91-9876543210"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_xxx",
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 450.00,
    "payment_url": "https://checkout.razorpay.com/v1/checkout.js",
    "gateway_order_id": "order_xxx",
    "status": "pending"
  }
}
```

### POST /payments/webhook
Payment gateway webhook (Razorpay, Stripe)

```bash
curl -X POST https://api.edennestfarm.com/v1/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.paid",
    "payload": {
      "order_id": "order_xxx",
      "payment_id": "pay_xxx",
      "status": "captured"
    }
  }'
```

### GET /payments/:paymentId
Get payment details

```bash
curl -X GET https://api.edennestfarm.com/v1/payments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN"
```

### POST /payments/:paymentId/refund
Initiate refund

```bash
curl -X POST https://api.edennestfarm.com/v1/payments/550e8400-e29b-41d4-a716-446655440000/refund \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refund_amount": 450.00,
    "reason": "Customer request"
  }'
```

---

## Analytics Endpoints

### GET /dashboard/kpis
Get real-time KPIs for executive dashboard

```bash
curl -X GET "https://api.edennestfarm.com/v1/dashboard/kpis?date=2024-01-15" \
  -H "Authorization: Bearer TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "today_revenue": 15000.00,
    "monthly_revenue": 450000.00,
    "total_customers": 1250,
    "active_subscribers": 450,
    "new_customers_today": 5,
    "customer_retention_rate": 87.5,
    "pending_payments": 25000.00,
    "pending_deliveries": 12,
    "completed_deliveries": 95,
    "failed_deliveries": 2,
    "delivery_cost": 5000.00,
    "total_production": 145500,
    "eggs_sold_today": 4500,
    "wastage_percentage": 1.03
  }
}
```

### GET /reports/sales
Sales report (period-based)

```bash
curl -X GET "https://api.edennestfarm.com/v1/reports/sales?period=monthly&date=2024-01" \
  -H "Authorization: Bearer TOKEN"
```

### GET /reports/production
Production report

```bash
curl -X GET "https://api.edennestfarm.com/v1/reports/production?farm_id=xxx&period=30days" \
  -H "Authorization: Bearer TOKEN"
```

### GET /reports/financial
Financial report (P&L, balance sheet)

```bash
curl -X GET "https://api.edennestfarm.com/v1/reports/financial?period=monthly&date=2024-01" \
  -H "Authorization: Bearer TOKEN"
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| UNAUTHORIZED | 401 | Token invalid or expired |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks required role/permission |
| RESOURCE_NOT_FOUND | 404 | Resource (farm, order, etc.) not found |
| DUPLICATE_ENTRY | 409 | Email, SKU, or other unique field already exists |
| VALIDATION_ERROR | 422 | Request validation failed |
| PAYMENT_FAILED | 402 | Payment processing failed |
| INVENTORY_INSUFFICIENT | 409 | Not enough stock available |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

- **Public endpoints**: 60 requests/minute
- **Authenticated endpoints**: 300 requests/minute
- **Admin endpoints**: 1000 requests/minute

---

## Pagination

All list endpoints support pagination:

```bash
curl "https://api.edennestfarm.com/v1/orders?page=2&limit=20&sort=created_at&order=desc"
```

Response includes:
```json
{
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 450,
      "total_pages": 23
    }
  }
}
```
