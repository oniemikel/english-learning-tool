import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon, Icons, type Icon as IconType } from '@/components/icons';

interface MetricCardProps {
  title: string;
  value: string | number; // ← number も受け取れるように変更
  change?: string;        // ← ? を付けてオプショナル（任意）に変更
  icon: IconType;
  color: string;
}

const MetricCard = ({ title, value, change, icon, color }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          {/* change が渡された時だけ表示する */}
          {change && <p className="text-xs text-muted-foreground">{change}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg`} style={{ backgroundColor: color }}>
          <Icon name={icon} className="h-6 w-6 text-primary-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;