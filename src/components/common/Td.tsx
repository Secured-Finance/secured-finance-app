import React from 'react';
import { Link } from 'react-router-dom';
import theme from '../../theme';

interface TdProps {
    children?: React.ReactNode,
    to?: string,
}

export const Td: React.FC<TdProps> = ({ to, children }) => {
  return (
    <td style={{
      padding: theme.spacing[3]+2,
    }}>
        {
            to != ''
            ?
            <Link to={to} style={{
              color: theme.colors.white,
              textTransform: 'none',
              textDecoration: 'none',
            }}>{children}</Link>
            :
            <>{children}</>
        }
    </td>
  );
}