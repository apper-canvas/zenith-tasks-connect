import tasksData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: 'pending',
      column: taskData.column || 'today',
      dueDate: taskData.dueDate,
      completedAt: null,
      createdAt: new Date(),
      order: taskData.order || 0
    }
    
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updateData }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }

  async moveTask(id, newColumn, newOrder) {
    await delay(200)
    const task = await this.getById(id)
    return this.update(id, { column: newColumn, order: newOrder })
  }

  async getByStatus(status) {
    await delay(250)
    return this.tasks.filter(t => t.status === status).map(t => ({ ...t }))
  }

  async getByColumn(column) {
    await delay(250)
    return this.tasks.filter(t => t.column === column && t.status === 'pending').map(t => ({ ...t }))
  }
}

export default new TaskService()