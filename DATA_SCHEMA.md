# Data Schema Represented using TypeScript and Zod Schema Validation

## Backup Data
```typescript
interface BackupData {
  metadata: {
    userId: string;
    shopId: string;
    createdAt: string;
    version: number;
    type?: string;
  };
  data: {
    shop: Shop;
    sales: Sale[];
    products?: Product[];
    expenses?: Expense[];
    categories?: Category[];
    discounts?: Discount[];
  };
}
```

## Shop
```typescript
export const ShopSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  name: z.string(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  businessType: z.string(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export type Shop = z.infer<typeof ShopSchema>;
```

## Sale

```typescript
export const SaleDiscountType = z.union([
  z.literal('AMOUNT'),
  z.literal('PERCENTAGE'),
]);

export const SaleDiscountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SaleDiscountType,
  value: z.number(),
});

export type SaleSicount = z.infer<typeof SaleDiscountSchema>;

const SaleItemCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SaleItemSchema = z.object({
  productId: z.string(),
  category: SaleItemCategorySchema,
  name: z.string(),
  price: z.number(),
  color: z.string(),
  quantity: z.number(),
  unitCost: z.number().optional().nullable(),
  cumulativeUnitCost: z.number().optional().nullable(),
  cumulativePrice: z.number(),
});

export type SaleItem = z.infer<typeof SaleItemSchema>;


export const SalePaymentTypeSchema = z.union([
  z.literal('CASH'),
  z.literal('CARD'),
  z.literal('QRIS'),
]);

export const SaleSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  paymentType: SalePaymentTypeSchema,
  shopId: z.string(),
  createdAt: z.date(),
  items: z.array(SaleItemSchema),
  subTotal: z.number(),
  grandTotal: z.number(),
  canceled: z.boolean().optional().nullable(),
  discount: SaleDiscountSchema.nullable().optional(),
  paymentAmount: z.number().optional().nullable(),
});

export type Sale = z.infer<typeof SaleSchema>;

export type SalePaymentType = z.infer<typeof SalePaymentTypeSchema>;

```

## Product
```typescript
const ProductCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const ProductDiscountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.union([z.literal('AMOUNT'), z.literal('PERCENTAGE')]),
  value: z.number(),
});

export const ProductSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  category: ProductCategorySchema,
  name: z.string(),
  price: z.number(),
  color: z.string(),
  unitCost: z.number().optional().nullable(),
  description: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  minimalStock: z.number().nullable().optional(),
  createdAt: z.date(),
  discounts: z.array(ProductDiscountSchema).optional().nullable(),
  barcode: z.string().nullable().optional(),
  stockTrackingEnabled: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductSchema>;
```

## Expense
```typescript
export const ExpenseCategorySchema = z.object({
  type: z.string(),
  name: z.string(),
  color: z.string(),
});

export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;

export const ExpenseStatusSchema = z.union([
  z.literal('UNPAID'),
  z.literal('PAID'),
]);

export type ExpenseStatus = z.infer<typeof ExpenseStatusSchema>;

export const ExpenseSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  createdAt: z.date(),
  value: z.number(),
  name: z.string(),
  category: ExpenseCategorySchema,
  status: ExpenseStatusSchema,
  paidAt: z.date(),
  notes: z.string().optional().nullable(),
});

export type Expense = z.infer<typeof ExpenseSchema>;
```

## Category
```typescript

export const CategorySchema = z.object({
  id: z.string(),
  shopId: z.string(),
  createdAt: z.date(),
  name: z.string(),
  isDefault: z.boolean(),
  description: z.string().nullable().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
```

## Discount
```typescript
export const DiscountSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  createdAt: z.date(),
  name: z.string(),
  type: z.union([z.literal('AMOUNT'), z.literal('PERCENTAGE')]),
  value: z.number(),
  description: z.string().optional().nullable(),
});

export type Discount = z.infer<typeof DiscountSchema>;
```

