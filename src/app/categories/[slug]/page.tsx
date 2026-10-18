import { CategoryProductsClient } from "@/components/categories/CategoryProductsClient";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryProductsPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryProductsClient slug={slug} />;
}
