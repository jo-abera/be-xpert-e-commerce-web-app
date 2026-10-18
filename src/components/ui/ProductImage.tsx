'use client';

import React, { useEffect, useState } from 'react';
import { ImageOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} — image unavailable` : 'Image unavailable'}
        className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        
        <ImageOffIcon className="h-7 w-7" aria-hidden="true" />
      </div>);

  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('bg-muted object-cover', className)} />);


}