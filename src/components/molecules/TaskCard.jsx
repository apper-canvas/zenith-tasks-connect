import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ task, onToggle, onDelete, getPriorityColor, index, ...rest }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index != null ? index * 0.1 : 0 }}
            className={`bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-4 hover-lift ${
                task.status === 'completed' ? 'task-completed opacity-60' : ''
            }`}
            {...rest} // For draggable
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                    <button
                        onClick={() => onToggle(task)}
                        className="mt-1 hover-press"
                    >
                        <div className={`w-6 h-6 border-4 border-concrete-border ${
                            task.status === 'completed' ? 'bg-accent' : 'bg-concrete-panel'
                        } flex items-center justify-center`}>
                            {task.status === 'completed' && (
                                <ApperIcon name="Check" className="w-4 h-4 text-concrete-void" />
                            )}
                        </div>
                    </button>
                    
                    <div className="flex-1">
                        <h3 className={`font-heading text-lg text-concrete-text mb-2 ${
                            task.status === 'completed' ? 'line-through' : ''
                        }`}>
                            {task.title}
                        </h3>
                        
                        {task.description && (
                            <p className="text-sm text-concrete-text opacity-80 mb-3">
                                {task.description}
                            </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs font-mono">
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 ${getPriorityColor(task.priority)}`}></div>
                                <span className="text-concrete-text tracking-wider">{task.priority.toUpperCase()}</span>
                            </div>
                            
                            {task.dueDate && (
                                <div className="flex items-center space-x-2">
                                    <ApperIcon name="Calendar" className="w-3 h-3 text-concrete-text" />
                                    <span className="text-concrete-text tracking-wider">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {task.status !== 'archived' && (
                    <button
                        onClick={() => onDelete(task.id)}
                        className="ml-4 p-2 bg-concrete-panel border-4 border-concrete-border hover-press"
                    >
                        <ApperIcon name="X" className="w-4 h-4 text-accent" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default TaskCard;