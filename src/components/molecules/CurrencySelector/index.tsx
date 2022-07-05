/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ArrowSVG } from 'src/components/atoms';
import theme from 'src/theme';
import { getCurrencyBy } from 'src/utils/currencyList';
import styled from 'styled-components';

interface CurrencySelectorProps {
    selectedCcy: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'collateral' | 'currencies';
}

const RenderImage = ({ selectedCcy }: { selectedCcy: string }) => {
    const { icon } = getCurrencyBy('shortName', selectedCcy);

    return <img width={28} src={icon} alt={selectedCcy} />;
};

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    selectedCcy,
    onClick,
    disabled,
}) => {
    return (
        <StyledCurrencySelector onClick={onClick} disabled={disabled}>
            <RenderImage selectedCcy={selectedCcy} />
            <StyledCurrencyText>{selectedCcy}</StyledCurrencyText>
            <StyledSVGContainer>
                {disabled ? null : (
                    <ArrowSVG
                        width={'15'}
                        height='6'
                        rotate={0}
                        fill={theme.colors.white}
                        stroke={theme.colors.white}
                    />
                )}
            </StyledSVGContainer>
        </StyledCurrencySelector>
    );
};

const StyledCurrencySelector = styled.button`
    min-width: 25%;
    background: transparent;
    outline: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
`;

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : '7px')};
    text-align: left;
`;

const StyledSVGContainer = styled.span`
    display: inline-block;
    margin-left: 2px;
`;
