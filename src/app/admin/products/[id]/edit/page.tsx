import { AdminProductEdit } from "@/components/admin/AdminProductEditClient";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { id } = await params;
  return <AdminProductEdit productId={id} />;
}
