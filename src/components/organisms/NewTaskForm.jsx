import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const NewTaskForm = ({ 
    isCreating, 
    newTask, 
    onNewTaskChange, 
    onCreateTask, 
    onCancelCreate, 
    inputRef 
}) => {
    return (
        <AnimatePresence>
            {isCreating && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-8"
                >
                    <h3 className="text-lg font-heading text-concrete-text mb-6 tracking-wider">CREATE.NEW.TASK</h3>
                    
                    <div className="space-y-4">
                        <Input
                            inputRef={inputRef}
                            type="text"
                            placeholder="TASK.TITLE"
                            value={newTask.title}
                            onChange={(e) => onNewTaskChange('title', e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onCreateTask()}
                            className="w-full"
                        />
                        
                        <Textarea
                            placeholder="TASK.DESCRIPTION"
                            value={newTask.description}
                            onChange={(e) => onNewTaskChange('description', e.target.value)}
                            rows={3}
                            className="w-full"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select
                                value={newTask.priority}
                                onChange={(e) => onNewTaskChange('priority', e.target.value)}
                            >
                                <option value="low">LOW.PRIORITY</option>
                                <option value="medium">MEDIUM.PRIORITY</option>
                                <option value="high">HIGH.PRIORITY</option>
                            </Select>
                            
                            <Select
                                value={newTask.column}
                                onChange={(e) => onNewTaskChange('column', e.target.value)}
                            >
                                <option value="today">TODAY</option>
                                <option value="tomorrow">TOMORROW</option>
                                <option value="later">LATER</option>
                            </Select>
                            
                            <Input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => onNewTaskChange('dueDate', e.target.value)}
                            />
                        </div>
                        
                        <div className="flex space-x-4">
                            <Button onClick={onCreateTask}>
                                CREATE.TASK
                            </Button>
                            <Button 
                                onClick={onCancelCreate} 
                                className="bg-concrete-panel border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
                            >
                                CANCEL
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewTaskForm;