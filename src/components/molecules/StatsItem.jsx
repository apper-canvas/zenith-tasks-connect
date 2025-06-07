import React from 'react';

const StatsItem = ({ value, label }) => {
    return (
        <div className="text-center">
            <div className="text-2xl font-heading text-concrete-text">{value}</div>
            <div className="text-xs font-mono text-concrete-text opacity-80 tracking-wider">{label}</div>
        </div>
    );
};

export default StatsItem;