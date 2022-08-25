import React from 'react';
import { CurrencyInfo, getCurrencyByIndex } from 'src/utils/currencyList';
import styled from 'styled-components';
import { ordinaryFormat, usdFormat } from '../../../../../utils/formatNumbers';

interface BalanceContainerProps {
    balance: number;
    value: number;
    index: number;
}

interface BalanceProps {
    currencies?: Array<CurrencyInfo>;
}

type ItemProps = BalanceContainerProps & BalanceProps;

const BalanceInfo: React.FC<ItemProps> = ({ index, balance, value }) => {
    const { symbol } = getCurrencyByIndex(index.toString());

    return (
        <div>
            <StyledBalance>
                <StyledWalletInfoContainer>
                    <StyledBalanceText>
                        {balance !== null ? ordinaryFormat(balance) : 0}{' '}
                        {symbol}
                    </StyledBalanceText>
                    <StyledBalanceSubtitle>
                        {value !== null ? usdFormat(value) : 0}
                    </StyledBalanceSubtitle>
                </StyledWalletInfoContainer>
            </StyledBalance>
        </div>
    );
};

const RenderBalance: React.FC<BalanceContainerProps> = ({
    balance,
    value,
    index,
}) => {
    return <BalanceInfo balance={balance} value={value} index={index} />;
};

const StyledBalance = styled.div`
    font-size: ${props => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

const StyledBalanceText = styled.div`
    font-size: ${props => props.theme.sizes.body}px;
    color: ${props => props.theme.colors.white};
    font-weight: 500;
`;

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledBalanceSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    font-size: ${props => props.theme.sizes.caption}px;
    color: ${props => props.theme.colors.gray};
    font-weight: 400;
`;

export default RenderBalance;
