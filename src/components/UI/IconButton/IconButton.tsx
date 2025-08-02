import React from 'react';
import './IconButton.scss';

interface IconButtonProps {
    onClick: () => void;
    text?: string;
    className?: string;
    ariaLabel: string;
}

const IconButton: React.FC<IconButtonProps> = ({
    text,
    onClick,
    ariaLabel,
}) => {
    return (
        <button
            className={`icon-button`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {text}
        </button>
    );
};

export default IconButton;