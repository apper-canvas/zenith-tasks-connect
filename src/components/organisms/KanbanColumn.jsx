import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';

const KanbanColumn = ({ 
    columnTitle, 
    tasks, 
    onDropTask, 
    onToggleTask, 
    onDeleteTask, 
    getPriorityColor 
}) => {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6"
            onDragOver={handleDragOver}
            onDrop={onDropTask}
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-heading text-concrete-text tracking-wider">
                    {columnTitle.toUpperCase()}
                </h2>
                <div className="bg-concrete-panel border-4 border-concrete-border px-3 py-1">
                    <span className="text-sm font-mono text-concrete-text">
                        {tasks.length}
                    </span>
                </div>
            </div>
            
            <div className="ascii-divider mb-6"></div>
            
            <AnimatePresence>
                {tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <ApperIcon name="Square" className="w-12 h-12 text-concrete-border mx-auto mb-4" />
                        <p className="text-sm font-mono text-concrete-border tracking-wider">
                            NO.TASKS.SCHEDULED
                        </p>
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onToggle={onToggleTask} 
                            onDelete={onDeleteTask} 
                            getPriorityColor={getPriorityColor} 
                            draggable={true} 
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                            index={index}
                        />
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};

export default KanbanColumn;