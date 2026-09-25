'use client';

import React, { useState } from 'react';
import { MobileShell } from '@/components/layout/mobile-shell';
import { Header } from '@/components/layout/header';
import { BottomNav, TabType } from '@/components/layout/bottom-nav';
import { HomeView } from '@/components/views/home-view';
import { ActivityView } from '@/components/views/activity-view';
import { StatsView } from '@/components/views/stats-view';
import { SettingsView } from '@/components/views/settings-view';
import { AIChatView } from '@/components/views/ai-chat-view';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda');

  return (
    <MobileShell>
      {/* 1. Header Sticky with clean logo without bg */}
      <Header activeTab={activeTab} />

      {/* 2. Main Content View Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'beranda' && (
          <HomeView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAI={() => setActiveTab('ai')}
          />
        )}
        {activeTab === 'aktivitas' && <ActivityView />}
        {activeTab === 'ai' && <AIChatView />}
        {activeTab === 'statistik' && <StatsView />}
        {activeTab === 'pengaturan' && <SettingsView />}
      </main>

      {/* 3. Bottom Navigation (5 Slots with Elevated AI Button switching to AI tab) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </MobileShell>
  );
}
