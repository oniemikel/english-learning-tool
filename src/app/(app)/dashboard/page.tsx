'use client';

import { useQuery } from '@tanstack/react-query';
import { PageTitle } from '@/components/ui/page-title';
import { getDashboardSummary } from '@/lib/mock-api';
import { StatCard } from '@/components/ui/stat-card';
import { BookCopy, Flame } from 'lucide-react';
import { DeckQuickView } from '@/components/dashboard/deck-quick-view';
import { RecentHistory } from '@/components/dashboard/recent-history';
import { ReviewsWidget } from '@/components/dashboard/reviews-widget';
import { ActivityHeatmap } from '@/components/dashboard/activity-heatmap';

export default function DashboardPage() {
  const summaryQuery = useQuery({ queryKey: ['dashboard-summary'], queryFn: getDashboardSummary });

  const stats = [
    {
      title: 'Learned Today',
      value: summaryQuery.data?.learnedToday ?? 0,
      icon: <BookCopy className="h-5 w-5 text-[var(--muted-foreground)]" />,
    },
    {
      title: 'Streak',
      value: `${summaryQuery.data?.streakDays ?? 0} days`,
      icon: <Flame className="h-5 w-5 text-[var(--muted-foreground)]" />,
    },
  ];

  return (
    <section>
      <PageTitle title="Dashboard" description="Here's a summary of your progress and upcoming reviews." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <ReviewsWidget className="lg:col-span-2" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              isLoading={summaryQuery.isLoading}
            />
          ))}
        </div>
        <ActivityHeatmap
          className="lg:col-span-4"
          data={summaryQuery.data?.activity}
          isLoading={summaryQuery.isLoading}
        />
        <DeckQuickView className="lg:col-span-2" />
        <RecentHistory className="lg:col-span-2" />
      </div>
    </section>
  );
}
