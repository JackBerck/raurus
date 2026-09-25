'use client';

import React, { ReactNode } from 'react';

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#040705] flex justify-center text-zinc-100 overflow-hidden">
      <div className="w-full max-w-md h-full max-h-[100dvh] bg-[#080d0a] border-x border-emerald-950/40 relative flex flex-col shadow-2xl shadow-black overflow-hidden">
        {children}
      </div>
    </div>
  );
}
