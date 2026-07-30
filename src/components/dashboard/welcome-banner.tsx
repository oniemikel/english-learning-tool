"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
}

// 時間帯に応じた挨拶を取得する関数
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

const WelcomeBanner = ({ name }: WelcomeBannerProps) => {
  const greeting = getGreeting();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          {greeting}, {name} 👋
        </h2>
        <p className="text-muted-foreground">
          Ready to start your study session?
        </p>
      </div>
      <Button asChild>
        <Link href="/study/quick-start">
          <Rocket className="mr-2 h-4 w-4" />
          Start Studying
        </Link>
      </Button>
    </div>
  );
};

export default WelcomeBanner;
