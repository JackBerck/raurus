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
      {/* 1. Header Sticky */}
      <Header activeTab={activeTab} />

      {/* 2. Main Content View Area (min-h-0 prevents flex children from expanding container) */}
      <main className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        {activeTab === 'beranda' && (
          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            <HomeView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAI={() => setActiveTab('ai')}
            />
          </div>
        )}

        {activeTab === 'aktivitas' && (
          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            <ActivityView />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex-1 min-h-0 overflow-hidden pb-20 flex flex-col">
            <AIChatView />
          </div>
        )}

        {activeTab === 'statistik' && (
          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            <StatsView />
          </div>
        )}

        {activeTab === 'pengaturan' && (
          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            <SettingsView />
          </div>
        )}
      </main>

      {/* 3. Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </MobileShell>
  );
}
