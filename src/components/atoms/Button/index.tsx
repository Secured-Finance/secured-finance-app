import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toKebabCase } from 'src/utils';
import styled, { ThemeContext } from 'styled-components';

interface ButtonProps {
    children?: React.ReactNode;
    disabled?: boolean;
    href?: string;
    onClick?: () => void;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    text?: string;
    to?: string;
    variant?: 'default' | 'blue' | 'orange';
    style?: StyledButtonProps;
}

interface StyledButtonProps {
    boxShadow?: string;
    color?: string;
    background?: string;
    disabled?: boolean;
    fontSize?: number;
    paddingRight?: number;
    paddingLeft?: number;
    size?: number;
    textTransform?: string;
    textAlign?: string;
    marginRight?: number;
    marginLeft?: number;
    marginTop?: number;
    marginBottom?: number;
    borderRadius?: number;
    outline?: string;
    height?: number;
    width?: string;
    minWidth?: number;
    fontWeight?: number;
    borderBottom?: string;
    borderWidth?: number;
    borderColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    disabled,
    href,
    onClick,
    size,
    text,
    to,
    variant,
    style,
}) => {
    const { colors, spacing } = useContext(ThemeContext);

    let buttonColor: string;
    let buttonBg: string;
    switch (variant) {
        case 'blue':
            buttonColor = colors.white;
            buttonBg = colors.lightBlue;
            break;
        case 'orange':
            buttonColor = colors.white;
            buttonBg = colors.orange;
            break;
        default:
    }

    let boxShadow: string;
    let buttonSize: number;
    let buttonPadding: number;
    let fontSize: number;
    switch (size) {
        case 'sm':
            buttonPadding = spacing[3];
            buttonSize = 36;
            fontSize = 14;
            break;
        case 'lg':
            buttonPadding = spacing[7];
            buttonSize = 44;
            fontSize = 16;
            break;
        case 'xs':
            buttonPadding = 10;
            buttonSize = 24;
            fontSize = 12;
            break;
        case 'md':
        default:
            buttonSize = 44;
            fontSize = 16;
    }

    const ButtonChild = useMemo(() => {
        if (to) {
            return <StyledLink to={to}>{text}</StyledLink>;
        } else if (href) {
            return (
                <StyledExternalLink href={href} target='__blank'>
                    {text}
                </StyledExternalLink>
            );
        } else {
            return text;
        }
    }, [href, text, to]);

    return (
        <StyledButton
            data-cy={`${toKebabCase(text)}-button`}
            boxShadow={boxShadow}
            color={style?.color ? style?.color : buttonColor}
            background={style?.background ? style?.background : buttonBg}
            disabled={disabled}
            fontSize={style?.fontSize ? style?.fontSize : fontSize}
            onClick={onClick}
            paddingRight={buttonPadding || style?.paddingRight}
            paddingLeft={buttonPadding || style?.paddingLeft}
            size={style?.height ? style?.height : buttonSize}
            textTransform={style?.textTransform}
            textAlign={style?.textAlign}
            marginBottom={style?.marginBottom}
            marginTop={style?.marginTop}
            marginLeft={style?.marginLeft}
            marginRight={style?.marginRight}
            outline={style?.outline}
            borderBottom={style?.borderBottom}
            // height={style?.height}
            width={style?.width}
            minWidth={style?.minWidth}
            fontWeight={style?.fontWeight}
            borderRadius={style?.borderRadius}
            borderWidth={style?.borderWidth}
            borderColor={style?.borderColor}
        >
            {children}
            {ButtonChild}
        </StyledButton>
    );
};

const StyledButton = styled.button<StyledButtonProps>`
    font-family: Inter, Arial, sans-serif;
    align-items: center;
    background-color: ${props => props.background};
    border: ${props => (props.borderWidth ? props.borderWidth : 1)}px solid
        ${props => (props.borderColor ? props.borderColor : props.background)};
    border-bottom: ${props =>
        props.borderBottom ? '1px solid ' + props.borderBottom : ''};
    border-radius: ${props => (props.borderRadius ? props.borderRadius : 6)}px;
    margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
    margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
    // box-shadow: ${props => props.boxShadow};
    color: ${props => props.color};
    cursor: pointer;
    min-width: ${props => props.minWidth};
    text-align: ${props => (props.textAlign ? props.textAlign : 'center')};
    text-transform: ${props =>
        props.textTransform ? props.textTransform : 'unset'};
    display: flex;
    font-size: ${props => props.fontSize}px;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 500)};
    height: ${props => props.size}px;
    justify-content: center;
    outline: ${props => (props.outline ? props.outline : 'none')};
    padding-left: ${props => props.paddingLeft}px;
    padding-right: ${props => props.paddingRight}px;
    pointer-events: ${props => (!props.disabled ? undefined : 'none')};
    width: ${props => (props.width ? props.width : '100%')};

    :disabled {
        opacity: 0.7;
    }
`;

const StyledLink = styled(Link)`
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1;
    height: 56px;
    justify-content: center;
    margin: 0 ${props => -props.theme.spacing[4]}px;
    padding: 0 ${props => props.theme.spacing[4]}px;
    text-decoration: none;
`;

const StyledExternalLink = styled.a`
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1;
    height: 56px;
    justify-content: center;
    margin: 0 ${props => -props.theme.spacing[4]}px;
    padding: 0 ${props => props.theme.spacing[4]}px;
    text-decoration: none;
`;
