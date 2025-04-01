import React from 'react';

interface Stat {
  label: string;
  value: number | string;
}

interface OverviewStatsProps {
  stats: Stat[];
  loading?: boolean;
  children?: React.ReactNode; // Add children prop
}

function OverviewStats({ stats, loading = false, children }: OverviewStatsProps) {
  return (
    <div className="overview-stats p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Overview Stats</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {stats.map((stat, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-gray-600">{stat.label}</span>
              <span className="font-semibold">{stat.value}</span>
            </li>
          ))}
        </ul>
      )}
      {children && <div className="additional-content">{children}</div>}
    </div>
  );
}

export default OverviewStats;