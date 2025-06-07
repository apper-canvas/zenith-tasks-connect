import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AppHeader = ({ darkMode, onToggleDarkMode }) => {
    return (
        <header className="bg-concrete-base border-b-4 border-concrete-border shadow-concrete relative">
            <div className="container mx-auto px-8 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6">
                            <ApperIcon name="Square" className="w-8 h-8 text-concrete-text" />
                        </div>
                        <div>
                            <h1 className="text-brutal font-heading text-concrete-text tracking-tighter">
                                ZENITH
                            </h1>
                            <div className="ascii-divider mt-2"></div>
                            <p className="text-sm font-mono text-concrete-text mt-2 tracking-wider">
                                TASKS.SYSTEM.v1.0
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={onToggleDarkMode}
                            className="bg-concrete-panel border-4 border-concrete-border p-4 hover-lift hover-press"
                        >
                            <ApperIcon 
                                name={darkMode ? "Sun" : "Moon"} 
                                className="w-6 h-6 text-concrete-text" 
                            />
                        </Button>
                        
                        <div className="bg-concrete-surface border-4 border-concrete-border p-4 shadow-concrete">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-accent"></div>
                                <span className="text-xs font-mono text-concrete-text tracking-wider">
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;