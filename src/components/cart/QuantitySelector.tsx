import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { MAX_QUANTITY } from "@/store/cart-store";
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  size?: 'sm' | 'md';
}

export function QuantitySelector({ value, onChange, label, size = 'md' }: QuantitySelectorProps) {
  const btn = cn(
    'flex items-center justify-center text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40',
    size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  );

  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-md border border-input">
      <button
        type="button"
        className={cn(btn, 'rounded-l-md')}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity">
        
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className={cn('min-w-[2.5rem] text-center text-sm font-medium tabular-nums')}>
        {value}
      </output>
      <button
        type="button"
        className={cn(btn, 'rounded-r-md')}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity">
        
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>);

}