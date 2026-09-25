'use client';

import React, { useState } from 'react';
import { MobileShell } from '@/components/layout/mobile-shell';
import { Header } from '@/components/layout/header';
import { BottomNav, TabType } from '@/components/layout/bottom-nav';
import { HomeView } from '@/components/views/home-view';
import { ActivityView } from '@/components/views/activity-view';
import { StatsView } from '@/components/views/stats-view';
import { SettingsView } from '@/components/views/settings-view';
import { AIInputSheet } from '@/components/views/ai-input-sheet';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <MobileShell>
      {/* 1. Header Sticky */}
      <Header activeTab={activeTab} />

      {/* 2. Main Content View Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'beranda' && (
          <HomeView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}
        {activeTab === 'aktivitas' && <ActivityView />}
        {activeTab === 'statistik' && <StatsView />}
        {activeTab === 'pengaturan' && <SettingsView />}
      </main>

      {/* 3. Bottom Navigation (5 Slots with Elevated AI Button) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* 4. AI Input Trigger Sheet */}
      <AIInputSheet
        open={isAIOpen}
        onOpenChange={(open) => setIsAIOpen(open)}
      />
    </MobileShell>
  );
}
