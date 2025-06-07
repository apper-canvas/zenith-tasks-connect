import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-concrete-void flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-concrete-surface border-4 border-concrete-border shadow-concrete p-16"
        >
          <ApperIcon name="AlertTriangle" className="w-24 h-24 text-accent mx-auto mb-8" />
          
          <h1 className="text-monument font-heading text-concrete-text mb-4">
            404
          </h1>
          
          <div className="ascii-divider mb-8"></div>
          
          <p className="text-lg text-concrete-text mb-8 font-mono tracking-wider">
            ROUTE.NOT.FOUND
          </p>
          
          <Link to="/">
            <motion.button
              whileHover={{ y: -4 }}
              whileTap={{ y: 4 }}
              className="bg-concrete-base border-4 border-concrete-border shadow-concrete px-8 py-4 text-concrete-text font-mono tracking-wider hover-lift hover-press"
            >
              RETURN.TO.BASE
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotFound