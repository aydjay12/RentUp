import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './Snackbar.css';

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const Snackbar = ({ message, type = 'info', isOpen, onClose, duration = 4000 }) => {
    const Icon = iconMap[type] || Info;

    useEffect(() => {
        if (isOpen && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={`snackbar snackbar-${type}`}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <div className="snackbar-content">
                        <Icon className="snackbar-icon" size={20} />
                        <span className="snackbar-message">{message}</span>
                        <button className="snackbar-close" onClick={onClose} aria-label="Close">
                            <X size={18} />
                        </button>
                    </div>
                    <motion.div
                        className="snackbar-progress"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: duration / 1000, ease: 'linear' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Snackbar;
