import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
        >
            <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-12">
                <ApperIcon name="Square" className="w-16 h-16 text-concrete-border mx-auto mb-6" />
                <h3 className="text-xl font-heading text-concrete-text mb-4">{title}</h3>
                <p className="text-concrete-text opacity-80 mb-8">{description}</p>
                <Button
                    onClick={onAction}
                    className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-8 py-4 text-concrete-text font-mono tracking-wider hover-lift hover-press"
                >
                    {actionLabel}
                </Button>
            </div>
        </motion.div>
    );
};

export default EmptyState;