// src/components/dashboard/welcome-banner.tsx
import { Button } from '@/components/ui/button';
import { DASHBOARD_DATA } from '@/lib/mock-data';
import { Icons } from '@/components/icons';

const WelcomeBanner = () => {
  const { name, cardsDue } = DASHBOARD_DATA.welcome;
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Good morning, {name} 👋</h2>
        <p className="text-gray-500">
          You have <span className="font-semibold text-gray-800">{cardsDue} cards</span> due
          today. Keep your streak alive!
        </p>
      </div>
      <Button>
        <Icons.ArrowRight className="mr-2 h-4 w-4" />
        Continue Study
        <span className="ml-2 text-gray-300">· {cardsDue} due</span>
      </Button>
    </div>
  );
};

export default WelcomeBanner;
