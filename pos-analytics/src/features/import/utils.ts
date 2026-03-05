import { db } from '../../db';
import { BackupDataSchema } from '../../lib/schemas';

export async function processBackupFile(file: File) {
  try {
    const text = await file.text();
    const json = JSON.parse(text);

    // 1. Validate Schema
    const parsedData = BackupDataSchema.parse(json);

    // 2. Clear existing data and bulk add
    await db.transaction('rw', [db.shops, db.sales, db.products, db.expenses, db.categories, db.discounts], async () => {
      await db.shops.clear();
      await db.sales.clear();
      await db.products.clear();
      await db.expenses.clear();
      await db.categories.clear();
      await db.discounts.clear();

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
