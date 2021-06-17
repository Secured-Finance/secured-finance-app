import React, { ReactNode } from 'react';
import cm from 'src/theme/typography.module.scss';
import cx from 'classnames';

interface ITypography {
    children: ReactNode;
    bold?: boolean;
}

export const Headline: React.FC<ITypography> = ({ children }) => (
    <span className={cm.headline}>{children}</span>
);

export const Title: React.FC<ITypography> = ({ children }) => (
    <span className={cm.title}>{children}</span>
);

export const Subtitle: React.FC<ITypography> = ({ children }) => (
    <span className={cm.subtitle}>{children}</span>
);

export const Text: React.FC<ITypography> = ({ bold, children }) => (
    <span className={cx(cm.text, bold && cm.textBold)}>{children}</span>
);
