import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsGrid from "@/components/dashboard/stats-grid";
import TodayProgressCard from "@/components/dashboard/today-progress-card";
import WeeklyProgress from "@/components/dashboard/weekly-progress";
import RecentDecks from "@/components/dashboard/recent-decks";
import WeeklyActivity from "@/components/dashboard/weekly-activity";
import { getDashboardPageData } from "@/lib/dashboard-data";
import RecentHistory from "@/components/dashboard/recent-history";
import ReviewsWidget from "@/components/dashboard/reviews-widget";
import StudyHeatmap from "@/components/dashboard/study-heatmap";
import WeakWordsCard from "@/components/dashboard/weak-words-card";
import { AnimatedContainer } from "@/components/animated-container";

export default async function DashboardPage() {
  const data = await getDashboardPageData();

  if (!data) {
    return null;
  }

  const {
    user,
    stats,
    todayProgress,
    studyGoals,
    recentDecks,
    weeklyActivity,
    studyHeatmap,
    weakWords,
    recentHistory,
    reviewsWidget,
  } = data;

  return (
    <div className="space-y-6">
      {/* 1. ウェルカムバナー */}
      <AnimatedContainer>
        <WelcomeBanner name={user.name} />
      </AnimatedContainer>

      {/* 2. 今日の進捗 & 週間進捗 */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
          <TodayProgressCard
            className="lg:col-span-2 h-full"
            newWords={todayProgress.newWords}
            reviews={todayProgress.reviews}
            target={todayProgress.target}
          />
          <WeeklyProgress goals={studyGoals} className="h-full" />
        </div>
      </AnimatedContainer>

      {/* 3. スタッツ概要 */}
      <AnimatedContainer delay={0.1}>
        <StatsGrid stats={stats} />
      </AnimatedContainer>

      {/* 4. アクション系：直近のデッキ & 苦手・要復習単語（2カラム） */}
      <AnimatedContainer delay={0.15}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-start">
          <RecentDecks decks={recentDecks} />
          <WeakWordsCard words={weakWords} />
        </div>
      </AnimatedContainer>

      {/* 5. グラフ系①：週間アクティビティ & 復習ステータス */}
      <AnimatedContainer delay={0.2}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-2">
            <WeeklyActivity
              labels={weeklyActivity.labels}
              series={weeklyActivity.series}
            />
          </div>
          <div className="h-full">
            <ReviewsWidget
              className="h-full"
              dueToday={reviewsWidget.dueToday}
              dueSoon={reviewsWidget.dueSoon}
              overdue={reviewsWidget.overdue}
            />
          </div>
        </div>
      </AnimatedContainer>

      {/* 6. グラフ系②：学習ヒートマップ & 直近の履歴 */}
      <AnimatedContainer delay={0.25}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <StudyHeatmap
              data={studyHeatmap.data}
              maxCount={studyHeatmap.maxCount}
            />
          </div>
          <div>
            <RecentHistory history={recentHistory} />
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
