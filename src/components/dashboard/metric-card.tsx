// src/components/dashboard/metric-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon, Icons, type Icon as IconType } from '@/components/icons';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: IconType;
  color: string;
}

const MetricCard = ({ title, value, change, icon, color }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{change}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg`} style={{ backgroundColor: color }}>
          <Icon name={icon} className="h-6 w-6 text-white" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
