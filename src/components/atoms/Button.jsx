import React from 'react';

const Button = ({ children, className, onClick, ...rest }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-concrete-base border-4 border-concrete-border shadow-concrete px-6 py-3 text-concrete-text font-mono tracking-wider hover-lift hover-press ${className || ''}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;