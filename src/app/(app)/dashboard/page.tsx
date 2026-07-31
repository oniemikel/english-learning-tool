import { Suspense } from "react";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsGrid from "@/components/dashboard/stats-grid";
import TodayProgressCard from "@/components/dashboard/today-progress-card";
import WeeklyProgress from "@/components/dashboard/weekly-progress";
import RecentDecks from "@/components/dashboard/recent-decks";
import WeeklyActivity from "@/components/dashboard/weekly-activity";
import RecentHistory from "@/components/dashboard/recent-history";
import ReviewsWidget from "@/components/dashboard/reviews-widget";
import StudyHeatmap from "@/components/dashboard/study-heatmap";
import WeakWordsCard from "@/components/dashboard/weak-words-card";
import { AnimatedContainer } from "@/components/animated-container";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/auth";
import {
  getCoreDashboardData,
  getWeakWordsData,
  getReviewsWidgetData,
  getStudyHeatmapData,
  getRecentHistoryData,
} from "@/lib/dashboard-data";

export default async function DashboardPage() {
  // 1. ファーストビュー用の軽量データ（数ミリ秒で即時取得）
  const coreData = await getCoreDashboardData();

  if (!coreData) return null;

  const { user, stats, todayProgress, studyGoals, recentDecks, dailyTarget } =
    coreData;

  // 後続の非同期コンポーネントで利用する userId を取得
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  return (
    <div className="space-y-6">
      {/* 1. ウェルカムバナー（即時表示） */}
      <AnimatedContainer>
        <WelcomeBanner name={user.name} />
      </AnimatedContainer>

      {/* 2. 今日の進捗 & 週間進捗（即時表示） */}
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

      {/* 3. スタッツ概要（即時表示） */}
      <AnimatedContainer delay={0.1}>
        <StatsGrid stats={stats} />
      </AnimatedContainer>

      {/* 4. アクション系：直近のデッキ（即時） & 苦手単語（非同期） */}
      <AnimatedContainer delay={0.15}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-start">
          <RecentDecks decks={recentDecks} />
          <Suspense fallback={<DashboardSectionSkeleton rows={4} />}>
            <AsyncWeakWordsSection userId={userId} />
          </Suspense>
        </div>
      </AnimatedContainer>

      {/* 5. グラフ系①：週間アクティビティ & 復習ステータス（非同期） */}
      <AnimatedContainer delay={0.2}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-2">
            <WeeklyActivity
              labels={coreData.studyGoals.map((g) => g.day.replace(".", ""))}
              series={[coreData.studyGoals.map((g) => g.progress)]}
            />
          </div>
          <div className="h-full">
            <Suspense fallback={<DashboardSectionSkeleton rows={3} />}>
              <AsyncReviewsWidgetSection userId={userId} />
            </Suspense>
          </div>
        </div>
      </AnimatedContainer>

      {/* 6. グラフ系②：学習ヒートマップ & 直近の履歴（非同期・重いクエリ） */}
      <AnimatedContainer delay={0.25}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <Suspense fallback={<DashboardSectionSkeleton rows={5} />}>
              <AsyncHeatmapSection userId={userId} dailyTarget={dailyTarget} />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<DashboardSectionSkeleton rows={4} />}>
              <AsyncRecentHistorySection userId={userId} />
            </Suspense>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}

// ------------------------------------------------------------------
// 重いデータ取得を担当する非同期（Async）サーバーコンポーネント群
// ------------------------------------------------------------------

async function AsyncWeakWordsSection({ userId }: { userId: string }) {
  const weakWords = await getWeakWordsData(userId);
  return <WeakWordsCard words={weakWords} />;
}

async function AsyncReviewsWidgetSection({ userId }: { userId: string }) {
  const reviewsWidget = await getReviewsWidgetData(userId);
  return (
    <ReviewsWidget
      className="h-full"
      dueToday={reviewsWidget.dueToday}
      dueSoon={reviewsWidget.dueSoon}
      overdue={reviewsWidget.overdue}
    />
  );
}

async function AsyncHeatmapSection({
  userId,
  dailyTarget,
}: {
  userId: string;
  dailyTarget: number;
}) {
  const heatmapData = await getStudyHeatmapData(userId);
  return <StudyHeatmap data={heatmapData} maxCount={dailyTarget} />;
}

async function AsyncRecentHistorySection({ userId }: { userId: string }) {
  const historyData = await getRecentHistoryData(userId);
  return <RecentHistory history={historyData} />;
}

// 共通ローディングスケルトン
function DashboardSectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 rounded-xl border p-6 bg-card">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className={`h-${rows * 10} w-full`} />
    </div>
  );
}
