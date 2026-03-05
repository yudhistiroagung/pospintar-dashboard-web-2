# Technical Implementation Guide: POS Analytics Web Dashboard

This document outlines the technical implementation plan for the POS Analytics Web Dashboard, based on the `WEB_APP_PRD.md` and `DATA_SCHEMA.md`.

## 1. Project Initialization & Setup

### Stack
- **Framework**: React + Vite + TypeScript
- **Routing**: TanStack Router
- **Database**: Dexie.js (IndexedDB wrapper)
- **Validation**: Zod
- **UI Components**: Shadcn UI + Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (Standard for React dashboards)

### Step-by-Step Setup

1.  **Initialize Project**:
    ```bash
    npm create vite@latest pos-analytics -- --template react-ts
    cd pos-analytics
    npm install
    ```

2.  **Install Core Dependencies**:
    ```bash
    npm install dexie zod @tanstack/react-router lucide-react recharts date-fns clsx tailwind-merge
    ```

3.  **Setup Tailwind CSS**:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    *Configure `tailwind.config.js` and `index.css` per standard Tailwind setup.*

4.  **Initialize Shadcn UI**:
    ```bash
    npx shadcn-ui@latest init
    ```
    *Follow the prompts (choose Slate, CSS variables: yes).*

5.  **Install UI Components**:
    ```bash
    npx shadcn-ui@latest add card button input table dialog toast progress sheet tabs badge calendar popover select
    ```

## 2. Directory Structure

```
src/
├── assets/
├── components/
│   ├── ui/             # Shadcn components
│   ├── layout/         # AppShell, Sidebar, BottomNav
│   ├── dashboard/      # Dashboard widgets (RevenueCard, etc.)
│   └── transactions/   # Transaction list components
├── db/
│   ├── index.ts        # Dexie database instance
│   └── schema.ts       # Database schema definition
├── hooks/              # Custom hooks (useShopData, useTransactions)
├── lib/
│   ├── utils.ts        # CN helper
│   └── schemas.ts      # Zod schemas (from DATA_SCHEMA.md)
├── routes/             # TanStack Router definitions
│   ├── __root.tsx
│   ├── index.tsx       # Dashboard
│   └── transactions.tsx
├── types/              # TypeScript interfaces (inferred from Zod)
├── App.tsx
└── main.tsx
```

## 3. Data Layer Implementation (Dexie.js)

We will use Dexie.js to store the parsed backup data locally.

### Database Schema (`src/db/index.ts`)

```typescript
import Dexie, { Table } from 'dexie';
import { Shop, Sale, Product, Expense, Category, Discount } from '../types';

export class PosDatabase extends Dexie {
  shops!: Table<Shop>;
  sales!: Table<Sale>;
  products!: Table<Product>;
  expenses!: Table<Expense>;
  categories!: Table<Category>;
  discounts!: Table<Discount>;

  constructor() {
    super('PosAnalyticsDB');
    
    // Define schema versions
    this.version(1).stores({
      shops: 'id, userId',
      sales: 'id, shopId, transactionId, paymentType, createdAt', // Indexed fields
      products: 'id, shopId, category.id, name',
      expenses: 'id, shopId, category.name, status, createdAt',
      categories: 'id, shopId',
      discounts: 'id, shopId'
    });
  }
}

export const db = new PosDatabase();
```

## 4. Data Import Feature

This is the core functionality: parsing the JSON backup file and populating IndexedDB.

### Zod Schemas (`src/lib/schemas.ts`)
*Copy the schemas provided in `DATA_SCHEMA.md` exactly.*

### Import Logic (`src/features/import/utils.ts`)

```typescript
import { z } from 'zod';
import { db } from '../../db';
import { BackupDataSchema } from '../../lib/schemas'; // Assuming a wrapper schema

export async function processBackupFile(file: File) {
  try {
    const text = await file.text();
    const json = JSON.parse(text);

    // 1. Validate Schema
    // Note: Parsing huge files might block main thread. 
    // For MVP, simple parse is okay. For large files, consider Web Workers.
    const parsedData = BackupDataSchema.parse(json);

    // 2. Clear existing data (Optional: based on user preference to merge or replace)
    // For MVP, we might want to wipe and replace to avoid conflicts
    await db.transaction('rw', db.shops, db.sales, db.products, db.expenses, db.categories, db.discounts, async () => {
      await db.shops.clear();
      await db.sales.clear();
      await db.products.clear();
      await db.expenses.clear();
      await db.categories.clear();
      await db.discounts.clear();

      // 3. Bulk Add
      await db.shops.add(parsedData.data.shop);
      if (parsedData.data.sales) await db.sales.bulkAdd(parsedData.data.sales);
      if (parsedData.data.products) await db.products.bulkAdd(parsedData.data.products);
      if (parsedData.data.expenses) await db.expenses.bulkAdd(parsedData.data.expenses);
      if (parsedData.data.categories) await db.categories.bulkAdd(parsedData.data.categories);
      if (parsedData.data.discounts) await db.discounts.bulkAdd(parsedData.data.discounts);
    });

    return { success: true, count: parsedData.data.sales?.length || 0 };
  } catch (error) {
    console.error("Import failed", error);
    return { success: false, error };
  }
}
```

## 5. Dashboard Implementation

The dashboard needs to calculate metrics dynamically from IndexedDB.

### Queries (`src/hooks/useDashboardMetrics.ts`)

```typescript
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export function useDashboardMetrics(dateRange: { start: Date, end: Date }) {
  return useLiveQuery(async () => {
    // 1. Revenue
    const sales = await db.sales
      .where('createdAt')
      .between(dateRange.start, dateRange.end)
      .toArray();
      
    const revenue = sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
    const transactionCount = sales.length;

    // 2. Expenses
    const expenses = await db.expenses
      .where('createdAt')
      .between(dateRange.start, dateRange.end)
      .toArray();
      
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.value || 0), 0);

    // 3. Profit
    const netProfit = revenue - totalExpenses;

    return {
      revenue,
      expenses: totalExpenses,
      netProfit,
      transactionCount,
      recentSales: sales.slice(0, 5) // For list view
    };
  }, [dateRange]);
}
```

## 6. Transaction List Implementation

Use TanStack Table (optional, or just map) for rendering the list with search/filter.

### Component Structure
- **Search Input**: Filters by ID or Amount.
- **Date Filter**: Shadcn DatePicker with Range.
- **Table**:
    - Columns: ID, Date, Payment Type, Items (Count), Total.
    - Pagination: Use Dexie's `offset()` and `limit()`.

## 7. UI/UX & Routing

### App Shell (`src/components/layout/AppShell.tsx`)
- **Desktop**: Sidebar navigation (Dashboard, Transactions, Settings/Import).
- **Mobile**: Bottom Tab Navigation.
- **Responsive**: Use Tailwind's `hidden md:flex` classes to toggle between Sidebar and Bottom Tab.

### Routing (`src/routes/__root.tsx`)
```typescript
import { createRootRoute, Outlet, Link } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen md:flex-row">
      <Sidebar className="hidden md:flex w-64 border-r" />
      <main className="flex-1 overflow-auto p-4 pb-20 md:pb-4">
        <Outlet />
      </main>
      <BottomNav className="md:hidden fixed bottom-0 w-full border-t bg-background" />
    </div>
  ),
});
```

## 8. Google Drive Integration (v1.1)

For the future update (v1.1), integrate the Google Drive Picker API.

1.  **OAuth Setup**: Create a project in Google Cloud Console, enable Drive API.
2.  **Picker API**: Use `react-google-drive-picker` or standard script injection.
3.  **Flow**:
    - User clicks "Import from Drive".
    - Auth popup -> User selects file.
    - App receives `fileId` and `accessToken`.
    - Fetch file content: `https://www.googleapis.com/drive/v3/files/{FILE_ID}?alt=media`.
    - Pass content to `processBackupFile` function defined above.

## 9. Next Steps

1.  Execute the project initialization commands.
2.  Create the `schemas.ts` file from the provided `DATA_SCHEMA.md`.
3.  Implement the Dexie database wrapper.
4.  Build the "Upload / Drag & Drop" component first to enable data testing.
5.  Build the Dashboard view.
