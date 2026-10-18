import React from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { ProductImage } from '../ui/ProductImage';
import type { Category } from '@/types/product';

export function CategoryCard({ category }: {category: Category;}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      
      <div className="overflow-hidden bg-muted">
        <ProductImage
          src={category.image}
          alt=""
          className="aspect-[4/3] w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        
      </div>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <p className="truncate text-sm font-semibold">{category.name}</p>
        <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary" aria-hidden="true" />
      </div>
    </Link>);

}