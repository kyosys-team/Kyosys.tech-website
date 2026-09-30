import { db, isDbConfigured } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import DbNotice from "@/components/admin/DbNotice";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Categories | Kyosys Admin" };

export default async function AdminCategoriesPage() {
  await requireAdminPage();
  if (!isDbConfigured()) return <DbNotice feature="category management" />;

  const categories = await db.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Categories</h1>
      <CategoriesManager initial={categories} />
    </div>
  );
}
