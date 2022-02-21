import React from 'react';
import { Link } from 'react-router-dom';

interface TrProps {
    children?: React.ReactNode;
    to?: string;
}

export const Tr: React.FC<TrProps> = ({ to, children }) => {
    return (
        <tr>{to != '' ? <Link to={to}>{children}</Link> : <>{children}</>}</tr>
    );
};
