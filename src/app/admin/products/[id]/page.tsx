import { AdminProductDetail } from "@/components/admin/AdminProductDetailClient";

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { id } = await params;
  return <AdminProductDetail productId={id} />;
}
