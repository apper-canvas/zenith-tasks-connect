import React from 'react';
import StatsItem from '@/components/molecules/StatsItem';

const StatsOverview = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsItem value={stats.totalCompleted} label="TOTAL.COMPLETED" />
                <StatsItem value={stats.completedToday} label="TODAY.COMPLETED" />
                <StatsItem value={stats.completedThisWeek} label="WEEK.COMPLETED" />
                <StatsItem value={`${Math.round(stats.averageCompletionTime)}h`} label="AVG.TIME" />
            </div>
        </div>
    );
};

export default StatsOverview;