import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const ActionBar = ({ 
    searchTerm, 
    onSearchChange, 
    onNewTask, 
    showArchive, 
    onToggleArchive, 
    onToggleShortcuts, 
    completedTasksCount, 
    onArchiveCompleted 
}) => {
    return (
        <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button onClick={onNewTask}>
                        + NEW.TASK
                    </Button>
                    
                    <div className="relative">
                        <Input
                            id="search-input"
                            type="text"
                            placeholder="SEARCH.TASKS"
                            value={searchTerm}
                            onChange={onSearchChange}
                            className="w-full sm:w-64"
                        />
                        <ApperIcon name="Search" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-concrete-border" />
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center space-x-4">
                    <Button
                        onClick={onToggleArchive}
                        className={`border-4 border-concrete-border shadow-concrete px-4 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press ${
                            showArchive ? 'bg-concrete-text text-concrete-base' : 'bg-concrete-panel'
                        }`}
                    >
                        {showArchive ? 'TASKS' : 'ARCHIVE'}
                    </Button>
                    
                    <Button 
                        onClick={onToggleShortcuts} 
                        className="bg-concrete-panel border-4 border-concrete-border shadow-concrete px-4 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
                    >
                        HELP
                    </Button>
                    
                    {completedTasksCount > 0 && !showArchive && (
                        <Button onClick={onArchiveCompleted}>
                            ARCHIVE.COMPLETED
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionBar;