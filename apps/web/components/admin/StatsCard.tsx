import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  loading?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export default function StatsCard({
  title,
  value,
  icon,
  actionLabel,
  actionHref,
  loading = false,
  color = 'blue'
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
              {icon}
            </div>
          )}
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-2xl font-semibold text-gray-900">
              {loading ? (
                <div className="h-7 bg-gray-200 rounded animate-pulse w-20" />
              ) : (
                value
              )}
            </dd>
          </div>
        </div>
      </div>
      {actionLabel && actionHref && (
        <div className="bg-gray-50 px-5 py-3">
          <a
            href={actionHref}
            className="text-sm font-medium text-primary-600 hover:text-primary-900"
          >
            {actionLabel} →
          </a>
        </div>
      )}
    </div>
  );
}