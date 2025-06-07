import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6"
                >
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-concrete-panel w-3/4"></div>
                        <div className="h-4 bg-concrete-panel w-1/2"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default SkeletonLoader;