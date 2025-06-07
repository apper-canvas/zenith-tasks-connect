import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';

const TaskList = ({ tasks, onToggleTask, onDeleteTask, getPriorityColor }) => {
    return (
        <div className="space-y-4">
            <AnimatePresence>
                {tasks.map((task, index) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onToggle={onToggleTask} 
                        onDelete={onDeleteTask} 
                        getPriorityColor={getPriorityColor} 
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TaskList;