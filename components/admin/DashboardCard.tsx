import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function DashboardCard({
  title,
  value,
  icon,
  color = 'blue',
  trend,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={clsx(
                'text-sm font-medium mt-2',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}% dari bulan lalu
            </p>
          )}
        </div>
        {icon && (
          <div className={clsx('p-3 rounded-lg border', colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
