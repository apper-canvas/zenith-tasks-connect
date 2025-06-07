import React from 'react';

const Input = ({ className, inputRef, ...rest }) => {
    return (
        <input
            ref={inputRef}
            className={`bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono placeholder-concrete-border focus:outline-none ${className || ''}`}
            {...rest}
        />
    );
};

export default Input;