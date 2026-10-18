import { AdminCategoryEdit } from "@/components/admin/AdminCategoryEditClient";

type AdminCategoryEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCategoryEditPage({
  params,
}: AdminCategoryEditPageProps) {
  const { id } = await params;
  return <AdminCategoryEdit categoryId={id} />;
}
