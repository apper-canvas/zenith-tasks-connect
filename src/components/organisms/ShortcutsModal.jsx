import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';

const ShortcutsModal = ({ showShortcuts, onClose }) => {
    if (!showShortcuts) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
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
                    
                    <Button 
                        onClick={onClose} 
                        className="mt-8 w-full bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press"
                    >
                        CLOSE.HELP
                    </Button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShortcutsModal;