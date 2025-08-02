import React from 'react';
import './Button.scss';

interface ButtonProps {
    text: string;
    onClick: () => void;
    fontFamily?: string;
    color?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, fontFamily, color }) => {

    return (
        <button
            className="button"
            onClick={onClick}
            style={{ fontFamily, color }}
        >
            {text}
        </button>
    );
};

export default Button;