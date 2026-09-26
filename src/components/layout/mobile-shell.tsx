'use client';

import React, { ReactNode } from 'react';

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-slate-200/50 dark:bg-[#040705] flex justify-center text-foreground overflow-hidden">
      <div className="w-full max-w-md h-full bg-background border-x border-border/80 dark:border-emerald-950/40 relative flex flex-col shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
