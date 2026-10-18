import { ProductDetailClient } from "@/components/products/ProductDetailClient";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
