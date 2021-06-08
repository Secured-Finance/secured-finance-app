import React from 'react';
import styled from 'styled-components';
import theme from 'src/theme';
import { currencyList } from 'src/utils/currencies';

interface CurrencySelectorProps {
    selectedCcy: string;
    showName?: boolean;
}

export const CurrencyImage: React.FC<CurrencySelectorProps> = ({
    selectedCcy,
    showName,
}) => {
    const icon: string = currencyList.find(
        currency => selectedCcy === currency.shortName
    )?.icon;

    return (
        <Container>
            <img width={28} src={icon} alt={`currency_${selectedCcy}`} />
            {showName && <CurrencyName>{selectedCcy}</CurrencyName>}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
`;

const CurrencyName = styled.span`
    margin-left: ${theme.spacing['2']}px;
    color: ${theme.colors.lightBackground};
`;
