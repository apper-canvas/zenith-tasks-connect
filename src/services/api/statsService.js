import statsData from '../mockData/stats.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class StatsService {
  constructor() {
    this.stats = [...statsData]
  }

  async getAll() {
    await delay(200)
    return [...this.stats]
  }

  async getById(id) {
    await delay(150)
    const stat = this.stats.find(s => s.id === id)
    if (!stat) {
      throw new Error('Stats not found')
    }
    return { ...stat }
  }

  async create(statData) {
    await delay(300)
    const newStat = {
      id: Date.now().toString(),
      totalCompleted: statData.totalCompleted || 0,
      completedToday: statData.completedToday || 0,
      completedThisWeek: statData.completedThisWeek || 0,
      averageCompletionTime: statData.averageCompletionTime || 0,
      createdAt: new Date()
    }
    
    this.stats.push(newStat)
    return { ...newStat }
  }

  async update(id, updateData) {
    await delay(250)
    const index = this.stats.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Stats not found')
    }
    
    this.stats[index] = { ...this.stats[index], ...updateData }
    return { ...this.stats[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.stats.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Stats not found')
    }
    
    this.stats.splice(index, 1)
    return true
  }

  async updateCompletionStats() {
    await delay(300)
    // Simulate updating completion statistics
    const currentStats = this.stats[0] || {
      id: '1',
      totalCompleted: 0,
      completedToday: 0,
      completedThisWeek: 0,
      averageCompletionTime: 0
    }
    
    return this.update(currentStats.id, {
      totalCompleted: currentStats.totalCompleted + 1,
      completedToday: currentStats.completedToday + 1,
      completedThisWeek: currentStats.completedThisWeek + 1
    })
  }
}

export default new StatsService()