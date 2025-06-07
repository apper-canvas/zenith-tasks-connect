import React from 'react';

const Textarea = ({ className, ...rest }) => {
    return (
        <textarea
            className={`bg-concrete-panel border-4 border-concrete-border shadow-concrete-inset px-4 py-3 text-concrete-text font-mono placeholder-concrete-border focus:outline-none resize-none ${className || ''}`}
            {...rest}
        />
    );
};

export default Textarea;