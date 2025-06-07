import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = ({ darkMode, setDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-concrete-void"
    >
      {/* Monolithic Header */}
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
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-concrete-panel border-4 border-concrete-border p-4 hover-lift hover-press shadow-concrete"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-6 h-6 text-concrete-text" 
                />
              </button>
              
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

      {/* Main Content */}
      <main className="relative">
        <MainFeature />
      </main>
    </motion.div>
  )
}

export default Home