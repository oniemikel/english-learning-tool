'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { useStudyStore } from '@/stores/study-store';
import { StatCard } from '@/components/ui/stat-card';
import { CheckCircle, Target, XCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function StudyResultPage() {
  const { solved, correct, reset } = useStudyStore();
  const accuracy = solved === 0 ? 0 : Math.round((correct / solved) * 100);

  // Reset the store when the component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const stats = [
    {
      title: 'Total Solved',
      value: solved,
      icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Correct Answers',
      value: correct,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      title: 'Incorrect Answers',
      value: solved - correct,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'Accuracy',
      value: `${accuracy}%`,
      icon: <Target className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <section>
      <PageTitle title="Study Session Results" description="Here's how you did in this session." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Link href="/study">
          <Button variant="outline">Study Again</Button>
        </Link>
        <Link href="/history">
          <Button variant="secondary">View History</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </section>
  );
}
