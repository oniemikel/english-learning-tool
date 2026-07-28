// src/components/dashboard/welcome-banner.tsx
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Rocket } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner = ({ name }: WelcomeBannerProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Good morning, {name} 👋</h2>
        <p className="text-gray-500">
          Ready to start your study session?
        </p>
      </div>
      <Button asChild>
        <Link href="/study">
          <Rocket className="mr-2 h-4 w-4" />
          Start Studying
        </Link>
      </Button>
    </div>
  );
};

export default WelcomeBanner;
