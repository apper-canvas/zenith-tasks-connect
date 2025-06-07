import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { taskService, statsService } from '../services'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showArchive, setShowArchive] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '', column: 'today' })
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef(null)

  // Load initial data
  useEffect(() => {
    loadTasks()
    loadStats()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'n':
            e.preventDefault()
            setIsCreating(true)
            setTimeout(() => inputRef.current?.focus(), 0)
            break
          case 'f':
            e.preventDefault()
            document.getElementById('search-input')?.focus()
            break
          case 'a':
            e.preventDefault()
            setShowArchive(!showArchive)
            break
          case '/':
            e.preventDefault()
            setShowShortcuts(!showShortcuts)
            break
          default:
            break
        }
      }
      if (e.key === 'Escape') {
        setIsCreating(false)
        setShowArchive(false)
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showArchive, showShortcuts])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await taskService.getAll()
      setTasks(result)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const result = await statsService.getAll()
      setStats(result[0] || { totalCompleted: 0, completedToday: 0, completedThisWeek: 0, averageCompletionTime: 0 })
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const createTask = async () => {
    if (!newTask.title.trim()) return
    
    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        order: tasks.filter(t => t.column === newTask.column && t.status === 'pending').length
      }
      
      const created = await taskService.create(taskData)
      setTasks(prev => [...prev, created])
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', column: 'today' })
      setIsCreating(false)
      toast.success('Task created successfully')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const toggleTask = async (task) => {
    try {
      const updatedTask = await taskService.update(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedAt: task.status === 'completed' ? null : new Date()
      })
      
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t))
      
      if (updatedTask.status === 'completed') {
        toast.success('Task completed! 🎯')
        loadStats() // Refresh stats
      } else {
        toast.info('Task reopened')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const moveTask = async (task, newColumn) => {
    try {
      const updatedTask = await taskService.update(task.id, { column: newColumn })
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t))
      toast.success(`Task moved to ${newColumn}`)
    } catch (err) {
      toast.error('Failed to move task')
    }
  }

  const archiveCompleted = async () => {
    try {
      const completedTasks = tasks.filter(t => t.status === 'completed')
      for (const task of completedTasks) {
        await taskService.update(task.id, { status: 'archived' })
      }
      setTasks(prev => prev.filter(t => t.status !== 'completed'))
      toast.success(`Archived ${completedTasks.length} completed tasks`)
    } catch (err) {
      toast.error('Failed to archive tasks')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (showArchive && task.status !== 'archived') return false
    if (!showArchive && task.status === 'archived') return false
    
    if (searchTerm) {
      return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             task.description.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  const getTasksByColumn = (column) => {
    return filteredTasks
      .filter(task => task.column === column && task.status === 'pending')
      .sort((a, b) => a.order - b.order)
  }

  const completedTasks = filteredTasks.filter(task => task.status === 'completed')
  const archivedTasks = filteredTasks.filter(task => task.status === 'archived')

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-accent'
      case 'medium': return 'bg-concrete-text'
      case 'low': return 'bg-concrete-border'
      default: return 'bg-concrete-border'
    }
  }

  const TaskCard = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-4 hover-lift ${
        task.status === 'completed' ? 'task-completed opacity-60' : ''
      }`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => toggleTask(task)}
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
        
        <button
          onClick={() => deleteTask(task.id)}
          className="ml-4 p-2 bg-concrete-panel border-4 border-concrete-border hover-press"
        >
          <ApperIcon name="X" className="w-4 h-4 text-accent" />
        </button>
      </div>
    </motion.div>
  )

  const SkeletonLoader = () => (
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
  )

  const EmptyState = ({ title, description, actionLabel, onAction }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-16"
    >
      <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-12">
        <ApperIcon name="Square" className="w-16 h-16 text-concrete-border mx-auto mb-6" />
        <h3 className="text-xl font-heading text-concrete-text mb-4">{title}</h3>
        <p className="text-concrete-text opacity-80 mb-8">{description}</p>
        <button
          onClick={onAction}
          className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-8 py-4 text-concrete-text font-mono tracking-wider hover-lift hover-press"
        >
          {actionLabel}
        </button>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-8">
        <SkeletonLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="bg-concrete-surface border-4 border-accent shadow-concrete p-8 text-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-lg font-heading text-concrete-text mb-4">SYSTEM.ERROR</h3>
          <p className="text-concrete-text mb-6">{error}</p>
          <button
            onClick={loadTasks}
            className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono hover-lift hover-press"
          >
            RETRY.LOAD
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Action Bar */}
      <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
            >
              + NEW.TASK
            </button>
            
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="SEARCH.TASKS"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono placeholder-concrete-border focus:outline-none w-full sm:w-64"
              />
              <ApperIcon name="Search" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-concrete-border" />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center space-x-4">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className={`border-4 border-concrete-border shadow-concrete px-4 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press ${
                showArchive ? 'bg-concrete-text text-concrete-base' : 'bg-concrete-panel'
              }`}
            >
              {showArchive ? 'TASKS' : 'ARCHIVE'}
            </button>
            
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="bg-concrete-panel border-4 border-concrete-border shadow-concrete px-4 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
            >
              HELP
            </button>
            
            {completedTasks.length > 0 && !showArchive && (
              <button
                onClick={archiveCompleted}
                className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-4 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
              >
                ARCHIVE.COMPLETED
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && !showArchive && (
        <div className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-heading text-concrete-text">{stats.totalCompleted}</div>
              <div className="text-xs font-mono text-concrete-text opacity-80 tracking-wider">TOTAL.COMPLETED</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading text-concrete-text">{stats.completedToday}</div>
              <div className="text-xs font-mono text-concrete-text opacity-80 tracking-wider">TODAY.COMPLETED</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading text-concrete-text">{stats.completedThisWeek}</div>
              <div className="text-xs font-mono text-concrete-text opacity-80 tracking-wider">WEEK.COMPLETED</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading text-concrete-text">{Math.round(stats.averageCompletionTime)}h</div>
              <div className="text-xs font-mono text-concrete-text opacity-80 tracking-wider">AVG.TIME</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Form */}
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
              <input
                ref={inputRef}
                type="text"
                placeholder="TASK.TITLE"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono placeholder-concrete-border focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && createTask()}
              />
              
              <textarea
                placeholder="TASK.DESCRIPTION"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono placeholder-concrete-border focus:outline-none resize-none"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  className="bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono focus:outline-none"
                >
                  <option value="low">LOW.PRIORITY</option>
                  <option value="medium">MEDIUM.PRIORITY</option>
                  <option value="high">HIGH.PRIORITY</option>
                </select>
                
                <select
                  value={newTask.column}
                  onChange={(e) => setNewTask(prev => ({ ...prev, column: e.target.value }))}
                  className="bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono focus:outline-none"
                >
                  <option value="today">TODAY</option>
                  <option value="tomorrow">TOMORROW</option>
                  <option value="later">LATER</option>
                </select>
                
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono focus:outline-none"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={createTask}
                  className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
                >
                  CREATE.TASK
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="bg-concrete-panel border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
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
              <div className="space-y-4">
                {archivedTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {['today', 'tomorrow', 'later'].map((column) => {
                const columnTasks = getTasksByColumn(column)
                return (
                  <div
                    key={column}
                    className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const taskId = e.dataTransfer.getData('text/plain')
                      const task = tasks.find(t => t.id === taskId)
                      if (task && task.column !== column) {
                        moveTask(task, column)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-heading text-concrete-text tracking-wider">
                        {column.toUpperCase()}
                      </h2>
                      <div className="bg-concrete-panel border-4 border-concrete-border px-3 py-1">
                        <span className="text-sm font-mono text-concrete-text">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ascii-divider mb-6"></div>
                    
                    <AnimatePresence>
                      {columnTasks.length === 0 ? (
                        <div className="text-center py-12">
                          <ApperIcon name="Square" className="w-12 h-12 text-concrete-border mx-auto mb-4" />
                          <p className="text-sm font-mono text-concrete-border tracking-wider">
                            NO.TASKS.SCHEDULED
                          </p>
                        </div>
                      ) : (
                        columnTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <TaskCard task={task} />
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="mt-8 bg-concrete-surface border-4 border-concrete-border shadow-concrete p-6">
                <h2 className="text-xl font-heading text-concrete-text mb-6 tracking-wider">
                  COMPLETED.TODAY
                </h2>
                <div className="ascii-divider mb-6"></div>
                <div className="space-y-4">
                  {completedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskCard task={task} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-heading text-concrete-text mb-6 tracking-wider">
                KEYBOARD.SHORTCUTS
              </h3>
              
              <div className="ascii-divider mb-6"></div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-concrete-text">Ctrl/Cmd + N</span>
                  <span className="text-concrete-border">NEW.TASK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-concrete-text">Ctrl/Cmd + F</span>
                  <span className="text-concrete-border">SEARCH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-concrete-text">Ctrl/Cmd + A</span>
                  <span className="text-concrete-border">ARCHIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-concrete-text">Ctrl/Cmd + /</span>
                  <span className="text-concrete-border">HELP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-concrete-text">Escape</span>
                  <span className="text-concrete-border">CLOSE</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowShortcuts(false)}
                className="mt-8 w-full bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
              >
                CLOSE.HELP
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature