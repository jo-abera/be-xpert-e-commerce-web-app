import { AdminUserDetail } from "@/components/admin/AdminUserDetailClient";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { id } = await params;
  return <AdminUserDetail userId={id} />;
}
