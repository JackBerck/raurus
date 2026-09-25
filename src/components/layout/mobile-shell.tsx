'use client';

import React, { ReactNode } from 'react';

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#040705] flex justify-center text-zinc-100">
      <div className="w-full max-w-md min-h-screen bg-[#080d0a] border-x border-emerald-950/40 relative flex flex-col shadow-2xl shadow-black pb-28">
        {children}
      </div>
    </div>
  );
}
