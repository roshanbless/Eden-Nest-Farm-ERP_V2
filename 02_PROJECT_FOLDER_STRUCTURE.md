# Eden Nest Farm ERP - Complete Project Folder Structure

```
eden-nest-erp/
│
├── README.md
├── .env.example
├── .gitignore
├── .github/
│   ├── CONTRIBUTING.md
│   ├── workflows/
│   │   ├── ci-cd.yml
│   │   ├── deploy-frontend.yml
│   │   └── deploy-backend.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── frontend/                           # Next.js + React + TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── og-image.png
│   │   └── icons/
│   │
│   ├── src/
│   │   ├── app/                       # Next.js 13+ App Router
│   │   │   ├── layout.tsx              # Root layout with Auth context
│   │   │   ├── page.tsx                # Landing/home page
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   └── reset-password/page.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx          # Dashboard shell
│   │   │   │   ├── page.tsx            # Executive dashboard (CEO view)
│   │   │   │   ├── (admin)/
│   │   │   │   │   ├── users/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   │   └── new/page.tsx
│   │   │   │   │   ├── roles/page.tsx
│   │   │   │   │   └── system/page.tsx
│   │   │   │   │
│   │   │   │   ├── (farm)/
│   │   │   │   │   ├── farms/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [farmId]/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── edit/page.tsx
│   │   │   │   │   │   │   ├── units/page.tsx
│   │   │   │   │   │   │   └── analytics/page.tsx
│   │   │   │   │   │   └── new/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── production/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [farmId]/page.tsx
│   │   │   │   │   │   ├── daily-entry/page.tsx
│   │   │   │   │   │   └── history/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── inventory/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [itemId]/page.tsx
│   │   │   │   │   │   ├── stock-in/page.tsx
│   │   │   │   │   │   ├── stock-out/page.tsx
│   │   │   │   │   │   └── expiry-tracking/page.tsx
│   │   │   │   │   │
│   │   │   │   │   └── quality/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       ├── inspections/page.tsx
│   │   │   │   │       └── batch-status/page.tsx
│   │   │   │   │
│   │   │   │   ├── (sales)/
│   │   │   │   │   ├── customers/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [customerId]/page.tsx
│   │   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   │   └── import/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [productId]/page.tsx
│   │   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   │   └── pricing/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── orders/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [orderId]/page.tsx
│   │   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   │   └── bulk-import/page.tsx
│   │   │   │   │   │
│   │   │   │   │   └── subscriptions/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       ├── [subscriptionId]/page.tsx
│   │   │   │   │       ├── plans/page.tsx
│   │   │   │   │       └── billing-cycles/page.tsx
│   │   │   │   │
│   │   │   │   ├── (logistics)/
│   │   │   │   │   ├── deliveries/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [deliveryId]/page.tsx
│   │   │   │   │   │   ├── dispatch/page.tsx
│   │   │   │   │   │   └── tracking/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── delivery-zones/page.tsx
│   │   │   │   │   ├── routes/page.tsx
│   │   │   │   │   └── driver-performance/page.tsx
│   │   │   │   │
│   │   │   │   ├── (finance)/
│   │   │   │   │   ├── payments/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [paymentId]/page.tsx
│   │   │   │   │   │   └── reconciliation/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── accounting/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── accounts/page.tsx
│   │   │   │   │   │   ├── journal-entries/page.tsx
│   │   │   │   │   │   ├── ledger/page.tsx
│   │   │   │   │   │   └── reports/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── suppliers/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [supplierId]/page.tsx
│   │   │   │   │   │   └── purchase-orders/page.tsx
│   │   │   │   │   │
│   │   │   │   │   └── employees/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       ├── [employeeId]/page.tsx
│   │   │   │   │       ├── payroll/page.tsx
│   │   │   │   │       └── schedules/page.tsx
│   │   │   │   │
│   │   │   │   ├── (analytics)/
│   │   │   │   │   ├── reports/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── sales-report/page.tsx
│   │   │   │   │   │   ├── production-report/page.tsx
│   │   │   │   │   │   ├── financial-report/page.tsx
│   │   │   │   │   │   └── custom-report/page.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── kpis/page.tsx
│   │   │   │   │   └── forecasting/page.tsx
│   │   │   │   │
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── profile/page.tsx
│   │   │   │       ├── preferences/page.tsx
│   │   │   │       └── integrations/page.tsx
│   │   │   │
│   │   │   ├── (customer-portal)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── subscriptions/page.tsx
│   │   │   │   ├── track-delivery/page.tsx
│   │   │   │   └── account/page.tsx
│   │   │   │
│   │   │   └── (driver-app)/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── today-route/page.tsx
│   │   │       ├── delivery/[id]/page.tsx
│   │   │       └── earnings/page.tsx
│   │   │
│   │   ├── components/                 # Reusable React components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── ExecutiveDashboard.tsx
│   │   │   │   ├── DashboardCard.tsx
│   │   │   │   ├── MetricsGrid.tsx
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   ├── ProductionChart.tsx
│   │   │   │   ├── CustomerGrowthChart.tsx
│   │   │   │   └── DeliveryMetrics.tsx
│   │   │   │
│   │   │   ├── farms/
│   │   │   │   ├── FarmList.tsx
│   │   │   │   ├── FarmCard.tsx
│   │   │   │   ├── FarmForm.tsx
│   │   │   │   ├── FarmDetails.tsx
│   │   │   │   └── FarmUnitsManager.tsx
│   │   │   │
│   │   │   ├── production/
│   │   │   │   ├── ProductionForm.tsx
│   │   │   │   ├── ProductionList.tsx
│   │   │   │   ├── DailyProductionEntry.tsx
│   │   │   │   ├── ProductionChart.tsx
│   │   │   │   └── BatchTracker.tsx
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── InventoryGrid.tsx
│   │   │   │   ├── StockInForm.tsx
│   │   │   │   ├── StockOutForm.tsx
│   │   │   │   ├── ExpiryAlert.tsx
│   │   │   │   └── BatchSelector.tsx
│   │   │   │
│   │   │   ├── customers/
│   │   │   │   ├── CustomerList.tsx
│   │   │   │   ├── CustomerCard.tsx
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   ├── CustomerProfile.tsx
│   │   │   │   ├── SegmentationChart.tsx
│   │   │   │   └── LTVCalculator.tsx
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── OrderForm.tsx
│   │   │   │   ├── OrderList.tsx
│   │   │   │   ├── OrderDetails.tsx
│   │   │   │   ├── OrderStatusTimeline.tsx
│   │   │   │   ├── OrderPacker.tsx
│   │   │   │   └── OrderInvoice.tsx
│   │   │   │
│   │   │   ├── subscriptions/
│   │   │   │   ├── SubscriptionForm.tsx
│   │   │   │   ├── SubscriptionList.tsx
│   │   │   │   ├── PlanSelector.tsx
│   │   │   │   ├── BillingCycleTracker.tsx
│   │   │   │   └── SubscriptionPauseModal.tsx
│   │   │   │
│   │   │   ├── deliveries/
│   │   │   │   ├── DeliveryMap.tsx
│   │   │   │   ├── DeliveryForm.tsx
│   │   │   │   ├── DispatchBoard.tsx
│   │   │   │   ├── TrackingMap.tsx
│   │   │   │   ├── DriverList.tsx
│   │   │   │   └── RouteOptimizer.tsx
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   ├── PaymentGatewaySelector.tsx
│   │   │   │   ├── ReconciliationTable.tsx
│   │   │   │   └── RefundForm.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── ReportBuilder.tsx
│   │   │   │   ├── SalesReport.tsx
│   │   │   │   ├── ProductionReport.tsx
│   │   │   │   ├── FinancialReport.tsx
│   │   │   │   ├── ExportButton.tsx
│   │   │   │   └── ChartRenderer.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Table.tsx
│   │   │       ├── Form.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── DatePicker.tsx
│   │   │       ├── Tabs.tsx
│   │   │       ├── Pagination.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Toast.tsx
│   │   │       ├── Spinner.tsx
│   │   │       ├── ConfirmDialog.tsx
│   │   │       └── EmptyState.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts             # Axios instance
│   │   │   │   ├── endpoints.ts          # API route constants
│   │   │   │   ├── auth.ts               # Auth API calls
│   │   │   │   ├── farms.ts
│   │   │   │   ├── production.ts
│   │   │   │   ├── inventory.ts
│   │   │   │   ├── customers.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── subscriptions.ts
│   │   │   │   ├── deliveries.ts
│   │   │   │   ├── payments.ts
│   │   │   │   ├── accounting.ts
│   │   │   │   └── analytics.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts            # Authentication hook
│   │   │   │   ├── useFarms.ts
│   │   │   │   ├── useProduction.ts
│   │   │   │   ├── useInventory.ts
│   │   │   │   ├── useCustomers.ts
│   │   │   │   ├── useOrders.ts
│   │   │   │   ├── useSubscriptions.ts
│   │   │   │   ├── useDeliveries.ts
│   │   │   │   ├── usePayments.ts
│   │   │   │   ├── useAsync.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   └── usePagination.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── format.ts             # Date, number, currency formatting
│   │   │   │   ├── validate.ts           # Form validation
│   │   │   │   ├── helpers.ts            # Common utilities
│   │   │   │   ├── constants.ts
│   │   │   │   ├── enums.ts
│   │   │   │   ├── storage.ts
│   │   │   │   └── error-handler.ts
│   │   │   │
│   │   │   └── context/
│   │   │       ├── AuthContext.ts
│   │   │       ├── NotificationContext.ts
│   │   │       └── FilterContext.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   ├── components.css
│   │   │   └── animations.css
│   │   │
│   │   └── types/
│   │       ├── index.ts
│   │       ├── api.ts
│   │       ├── models.ts
│   │       ├── enums.ts
│   │       └── forms.ts
│   │
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
├── backend/                            # Node.js + NestJS
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   │
│   ├── src/
│   │   ├── main.ts                      # Application entry point
│   │   ├── app.module.ts                # Root module
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── auth.config.ts
│   │   │   ├── email.config.ts
│   │   │   └── payment.config.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   └── permissions.guard.ts
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── current-user.decorator.ts
│   │   │   │   │   ├── roles.decorator.ts
│   │   │   │   │   └── permissions.decorator.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       ├── signup.dto.ts
│   │   │   │       └── refresh-token.dto.ts
│   │   │   │
│   │   │   ├── farms/
│   │   │   │   ├── farms.module.ts
│   │   │   │   ├── farms.controller.ts
│   │   │   │   ├── farms.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── farm.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-farm.dto.ts
│   │   │   │   │   └── update-farm.dto.ts
│   │   │   │   └── farm-units/
│   │   │   │       ├── farm-units.controller.ts
│   │   │   │       ├── farm-units.service.ts
│   │   │   │       └── dto/
│   │   │   │
│   │   │   ├── production/
│   │   │   │   ├── production.module.ts
│   │   │   │   ├── production.controller.ts
│   │   │   │   ├── production.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── production.entity.ts
│   │   │   │   │   └── batch.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-production.dto.ts
│   │   │   │   │   └── create-batch.dto.ts
│   │   │   │   └── quality/
│   │   │   │       ├── quality-checks.controller.ts
│   │   │   │       ├── quality-checks.service.ts
│   │   │   │       └── dto/
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── inventory.module.ts
│   │   │   │   ├── inventory.controller.ts
│   │   │   │   ├── inventory.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── inventory-item.entity.ts
│   │   │   │   │   └── inventory-transaction.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── stock-in.dto.ts
│   │   │   │   │   ├── stock-out.dto.ts
│   │   │   │   │   └── adjustment.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── stock-management.service.ts
│   │   │   │       ├── expiry-tracking.service.ts
│   │   │   │       └── low-stock-alert.service.ts
│   │   │   │
│   │   │   ├── customers/
│   │   │   │   ├── customers.module.ts
│   │   │   │   ├── customers.controller.ts
│   │   │   │   ├── customers.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── customer.entity.ts
│   │   │   │   │   ├── customer-address.entity.ts
│   │   │   │   │   └── customer-preferences.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-customer.dto.ts
│   │   │   │   │   └── update-customer.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── customer-segmentation.service.ts
│   │   │   │       ├── customer-lifetime-value.service.ts
│   │   │   │       └── churn-prediction.service.ts
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── products.module.ts
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── product.entity.ts
│   │   │   │   │   └── product-pricing.entity.ts
│   │   │   │   └── dto/
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── orders.module.ts
│   │   │   │   ├── orders.controller.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   └── order-item.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-order.dto.ts
│   │   │   │   │   └── update-order-status.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── order-processing.service.ts
│   │   │   │       ├── order-workflow.service.ts
│   │   │   │       └── order-notification.service.ts
│   │   │   │
│   │   │   ├── subscriptions/
│   │   │   │   ├── subscriptions.module.ts
│   │   │   │   ├── subscriptions.controller.ts
│   │   │   │   ├── subscriptions.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── subscription.entity.ts
│   │   │   │   │   ├── subscription-plan.entity.ts
│   │   │   │   │   └── subscription-billing-cycle.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-subscription.dto.ts
│   │   │   │   │   └── pause-subscription.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── billing-cycle.service.ts
│   │   │   │       ├── renewal.service.ts
│   │   │   │       └── cancellation.service.ts
│   │   │   │
│   │   │   ├── deliveries/
│   │   │   │   ├── deliveries.module.ts
│   │   │   │   ├── deliveries.controller.ts
│   │   │   │   ├── deliveries.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── delivery.entity.ts
│   │   │   │   │   ├── delivery-zone.entity.ts
│   │   │   │   │   └── delivery-tracking.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-delivery.dto.ts
│   │   │   │   │   └── update-tracking.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── route-optimization.service.ts
│   │   │   │       ├── gps-tracking.service.ts
│   │   │   │       └── delivery-notification.service.ts
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── payment.entity.ts
│   │   │   │   │   └── payment-reconciliation.entity.ts
│   │   │   │   ├── gateways/
│   │   │   │   │   ├── razorpay.gateway.ts
│   │   │   │   │   ├── stripe.gateway.ts
│   │   │   │   │   └── payment-gateway.interface.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-payment.dto.ts
│   │   │   │   │   └── refund-payment.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── payment-processing.service.ts
│   │   │   │       ├── reconciliation.service.ts
│   │   │   │       └── webhook-handler.service.ts
│   │   │   │
│   │   │   ├── accounting/
│   │   │   │   ├── accounting.module.ts
│   │   │   │   ├── accounting.controller.ts
│   │   │   │   ├── accounting.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── account.entity.ts
│   │   │   │   │   ├── journal-entry.entity.ts
│   │   │   │   │   └── account-ledger.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── create-journal-entry.dto.ts
│   │   │   │   └── services/
│   │   │   │       ├── gl-posting.service.ts
│   │   │   │       ├── ledger.service.ts
│   │   │   │       └── financial-reporting.service.ts
│   │   │   │
│   │   │   ├── suppliers/
│   │   │   │   ├── suppliers.module.ts
│   │   │   │   ├── suppliers.controller.ts
│   │   │   │   ├── suppliers.service.ts
│   │   │   │   └── entities/
│   │   │   │
│   │   │   ├── employees/
│   │   │   │   ├── employees.module.ts
│   │   │   │   ├── employees.controller.ts
│   │   │   │   ├── employees.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── employee.entity.ts
│   │   │   │   │   └── employee-schedule.entity.ts
│   │   │   │   └── services/
│   │   │   │       ├── payroll.service.ts
│   │   │   │       └── schedule-management.service.ts
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── analytics.module.ts
│   │   │       ├── analytics.controller.ts
│   │   │       ├── analytics.service.ts
│   │   │       ├── services/
│   │   │       │   ├── kpi-calculation.service.ts
│   │   │       │   ├── forecasting.service.ts
│   │   │       │   ├── customer-analytics.service.ts
│   │   │       │   ├── production-analytics.service.ts
│   │   │       │   ├── sales-analytics.service.ts
│   │   │       │   └── financial-analytics.service.ts
│   │   │       └── reports/
│   │   │
│   │   ├── shared/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   ├── error-handling.interceptor.ts
│   │   │   │   ├── transform.interceptor.ts
│   │   │   │   └── request-timeout.interceptor.ts
│   │   │   ├── filters/
│   │   │   │   ├── http-exception.filter.ts
│   │   │   │   └── validation-exception.filter.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── logger.middleware.ts
│   │   │   │   └── cors.middleware.ts
│   │   │   ├── pipes/
│   │   │   │   ├── validation.pipe.ts
│   │   │   │   └── parse-uuid.pipe.ts
│   │   │   ├── decorators/
│   │   │   │   ├── is-unique.decorator.ts
│   │   │   │   └── is-valid-date.decorator.ts
│   │   │   └── utils/
│   │   │       ├── logger.ts
│   │   │       ├── validators.ts
│   │   │       └── helpers.ts
│   │   │
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   │   ├── 001_init_schema.sql
│   │   │   │   ├── 002_add_rls_policies.sql
│   │   │   │   └── [...]
│   │   │   └── seeds/
│   │   │       ├── roles.seed.ts
│   │   │       ├── users.seed.ts
│   │   │       └── products.seed.ts
│   │   │
│   │   └── jobs/
│   │       ├── subscriptions/
│   │       │   ├── billing-cycle.job.ts
│   │       │   ├── renewal.job.ts
│   │       │   └── reminder.job.ts
│   │       ├── inventory/
│   │       │   └── expiry-alert.job.ts
│   │       ├── payments/
│   │       │   └── reconciliation.job.ts
│   │       └── notifications/
│   │           └── send-email.job.ts
│   │
│   ├── test/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   └── Dockerfile
│
├── mobile/                             # Future: React Native
│   └── README.md
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── CONTRIBUTING.md
│   ├── SETUP.md
│   ├── TROUBLESHOOTING.md
│   └── API_EXAMPLES/
│       ├── auth-examples.md
│       ├── farm-examples.md
│       ├── order-examples.md
│       ├── subscription-examples.md
│       └── [...]
│
├── infrastructure/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── kubernetes/ (future)
│
├── scripts/
│   ├── setup.sh
│   ├── migrate.sh
│   ├── seed.sh
│   ├── backup.sh
│   ├── restore.sh
│   ├── test.sh
│   └── deploy.sh
│
└── .env.example
```

This structure provides:
- **Clear module separation** for independent development and testing
- **Scalable routing** for handling new features without chaos
- **Organized components** by feature domain
- **Centralized API layer** for consistent backend integration
- **Shared utilities** to avoid duplication
- **Test folders** at each level
- **Infrastructure** and deployment configuration
- **Documentation** alongside code
