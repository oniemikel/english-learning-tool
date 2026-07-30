import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsGrid from "@/components/dashboard/stats-grid";
import TodayProgressCard from "@/components/dashboard/today-progress-card";
import WeeklyProgress from "@/components/dashboard/weekly-progress";
import RecentDecks from "@/components/dashboard/recent-decks";
import WeeklyActivity from "@/components/dashboard/weekly-activity";
import { getDashboardPageData } from "@/lib/dashboard-data";
import DeckQuickView from "@/components/dashboard/deck-quick-view";
import RecentHistory from "@/components/dashboard/recent-history";
import ReviewsWidget from "@/components/dashboard/reviews-widget";

export default async function DashboardPage() {
  const data = await getDashboardPageData();

  if (!data) {
    // Or a loading/error component
    return null;
  }

  const {
    user,
    stats,
    todayProgress,
    studyGoals,
    recentDecks,
    weeklyActivity,
    deckQuickView,
    recentHistory,
    reviewsWidget,
  } = data;

  return (
    <div className="space-y-6">
      <WelcomeBanner name={user.name} />

      {/* 今日の進捗 & 週間進捗のグリッド（高さを揃える） */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <TodayProgressCard
          className="lg:col-span-2 h-full"
          newWords={todayProgress.newWords}
          reviews={todayProgress.reviews}
          target={todayProgress.target}
        />
        <WeeklyProgress goals={studyGoals} className="h-full" />
      </div>
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentDecks decks={recentDecks} />
        <WeeklyActivity
          labels={weeklyActivity.labels}
          series={weeklyActivity.series}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DeckQuickView decks={deckQuickView} />
        </div>
        <div className="space-y-6">
          <ReviewsWidget
            dueToday={reviewsWidget.dueToday}
            dueSoon={reviewsWidget.dueSoon}
            overdue={reviewsWidget.overdue}
          />
          <RecentHistory history={recentHistory} />
        </div>
      </div>
    </div>
  );
}
