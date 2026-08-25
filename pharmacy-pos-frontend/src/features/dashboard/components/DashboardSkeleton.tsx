import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card.js';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-2">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-3xl shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-3xl h-80 animate-pulse bg-slate-100 dark:bg-[#131B2A]" />
        </div>
        <div>
          <Card className="rounded-3xl h-80 animate-pulse bg-slate-100 dark:bg-[#131B2A]" />
        </div>
      </div>
    </div>
  );
};
