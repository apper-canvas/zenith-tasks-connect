import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, statsService } from '@/services';

import ApperIcon from '@/components/ApperIcon';
import AppHeader from '@/components/organisms/AppHeader';
import ActionBar from '@/components/organisms/ActionBar';
import StatsOverview from '@/components/organisms/StatsOverview';
import NewTaskForm from '@/components/organisms/NewTaskForm';
import KanbanColumn from '@/components/organisms/KanbanColumn';
import TaskList from '@/components/organisms/TaskList';
import ShortcutsModal from '@/components/organisms/ShortcutsModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';

const HomePage = ({ darkMode, setDarkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '', column: 'today' });
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'n':
            e.preventDefault();
            setIsCreating(true);
            setTimeout(() => inputRef.current?.focus(), 0);
            break;
          case 'f':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'a':
            e.preventDefault();
            setShowArchive(!showArchive);
            break;
          case '/':
            e.preventDefault();
            setShowShortcuts(!showShortcuts);
            break;
          default:
            break;
        }
      }
      if (e.key === 'Escape') {
        setIsCreating(false);
        setShowArchive(false);
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showArchive, showShortcuts]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await statsService.getAll();
      setStats(result[0] || { totalCompleted: 0, completedToday: 0, completedThisWeek: 0, averageCompletionTime: 0 });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleNewTaskChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        order: tasks.filter(t => t.column === newTask.column && t.status === 'pending').length
      };
      
      const created = await taskService.create(taskData);
      setTasks(prev => [...prev, created]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', column: 'today' });
      setIsCreating(false);
      toast.success('Task created successfully');
      loadStats();
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const updatedTask = await taskService.update(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedAt: task.status === 'completed' ? null : new Date()
      });
      
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      
      if (updatedTask.status === 'completed') {
        toast.success('Task completed! 🎯');
        loadStats();
      } else {
        toast.info('Task reopened');
        loadStats();
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
      loadStats();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const moveTask = async (task, newColumn) => {
    try {
      const updatedTask = await taskService.update(task.id, { column: newColumn });
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      toast.success(`Task moved to ${newColumn}`);
    } catch (err) {
      toast.error('Failed to move task');
    }
  };

  const archiveCompleted = async () => {
    try {
      const completedTasksToArchive = tasks.filter(t => t.status === 'completed');
      if (completedTasksToArchive.length === 0) {
        toast.info('No completed tasks to archive.');
        return;
      }
      for (const task of completedTasksToArchive) {
        await taskService.update(task.id, { status: 'archived' });
      }
      setTasks(prev => prev.filter(t => t.status !== 'completed'));
      toast.success(`Archived ${completedTasksToArchive.length} completed tasks`);
    } catch (err) {
      toast.error('Failed to archive tasks');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (showArchive && task.status !== 'archived') return false;
    if (!showArchive && task.status === 'archived') return false;
    
    if (searchTerm) {
      return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             task.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getTasksByColumn = (column) => {
    return filteredTasks
      .filter(task => task.column === column && task.status === 'pending')
      .sort((a, b) => a.order - b.order);
  };

  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  const archivedTasks = filteredTasks.filter(task => task.status === 'archived');

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-accent';
      case 'medium': return 'bg-concrete-text';
      case 'low': return 'bg-concrete-border';
      default: return 'bg-concrete-border';
    }
  };

  if (loading) {
    return (
      <>
        <AppHeader darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <main className="relative container mx-auto px-8 py-8">
            <SkeletonLoader />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <main className="relative container mx-auto px-8 py-8">
            <div className="bg-concrete-surface border-4 border-accent shadow-concrete p-8 text-center">
                <ApperIcon name="AlertTriangle" className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-heading text-concrete-text mb-4">SYSTEM.ERROR</h3>
                <p className="text-concrete-text mb-6">{error}</p>
                <Button
                    onClick={loadTasks}
                    className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono hover-lift hover-press"
                >
                    RETRY.LOAD
                </Button>
            </div>
        </main>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-concrete-void"
    >
      <AppHeader darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="relative container mx-auto px-8 py-8">
        <ActionBar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onNewTask={() => {
            setIsCreating(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          showArchive={showArchive}
          onToggleArchive={() => setShowArchive(!showArchive)}
          onToggleShortcuts={() => setShowShortcuts(!showShortcuts)}
          completedTasksCount={completedTasks.length}
          onArchiveCompleted={archiveCompleted}
        />

        {stats && !showArchive && <StatsOverview stats={stats} />}

        <NewTaskForm
          isCreating={isCreating}
          newTask={newTask}
          onNewTaskChange={handleNewTaskChange}
          onCreateTask={createTask}
          onCancelCreate={() => setIsCreating(false)}
          inputRef={inputRef}
        />

        <AnimatePresence mode="wait">
          {showArchive ? (
            <motion.div
              key="archive"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6"
            >
              <h2 className="text-2xl font-heading text-concrete-text mb-8 tracking-wider">ARCHIVE.SYSTEM</h2>
              
              {archivedTasks.length === 0 ? (
                <EmptyState
                  title="ARCHIVE.EMPTY"
                  description="No archived tasks found in the system"
                  actionLabel="RETURN.TO.TASKS"
                  onAction={() => setShowArchive(false)}
                />
              ) : (
                <TaskList 
                    tasks={archivedTasks} 
                    onToggleTask={toggleTask} 
                    onDeleteTask={deleteTask} 
                    getPriorityColor={getPriorityColor} 
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {['today', 'tomorrow', 'later'].map((column) => (
                  <KanbanColumn
                    key={column}
                    columnTitle={column}
                    tasks={getTasksByColumn(column)}
                    onDropTask={(e) => {
                      e.preventDefault();
                      const taskId = e.dataTransfer.getData('text/plain');
                      const task = tasks.find(t => t.id === taskId);
                      if (task && task.column !== column) {
                        moveTask(task, column);
                      }
                    }}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>

              {completedTasks.length > 0 && (
                <div className="mt-8 bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6">
                  <h2 className="text-xl font-heading text-concrete-text mb-6 tracking-wider">
                    COMPLETED.TODAY
                  </h2>
                  <div className="ascii-divider mb-6"></div>
                  <TaskList 
                    tasks={completedTasks} 
                    onToggleTask={toggleTask} 
                    onDeleteTask={deleteTask} 
                    getPriorityColor={getPriorityColor} 
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ShortcutsModal 
        showShortcuts={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </motion.div>
  );
};

export default HomePage;