import React from 'react';

const Select = ({ children, className, ...rest }) => {
    return (
        <select
            className={`bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono focus:outline-none ${className || ''}`}
            {...rest}
        >
            {children}
        </select>
    );
};

export default Select;