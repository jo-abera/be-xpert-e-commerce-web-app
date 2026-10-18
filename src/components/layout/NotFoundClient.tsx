'use client';

import React from 'react';
import Link from 'next/link';
import { CompassIcon } from 'lucide-react';
import { StateMessage } from '@/components/ui/StateMessage';
import { buttonVariants } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundClient() {
  useDocumentTitle('Page not found');
  return (
    <StateMessage
      icon={CompassIcon}
      title="Page not found"
      description="The page you're looking for doesn't exist."
      action={<Link href="/" className={buttonVariants('primary')}>Go home</Link>}
      className="mt-8" />);


}