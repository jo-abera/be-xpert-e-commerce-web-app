import React from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { cn } from '@/lib/utils';

interface AdminSearchInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AdminSearchInput({ id, label, placeholder, value, onChange, className }: AdminSearchInputProps) {
  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl bg-card pl-10 shadow-sm" />
      
    </div>);

}