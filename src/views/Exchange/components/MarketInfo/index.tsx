import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import ArrowSVG from '../../../../components/ArrowSVG';
import { useEthereumUsd, useFilUsd } from '../../../../hooks/useAssetPrices';
import { useRates } from '../../../../hooks/useRates';
import useSF from '../../../../hooks/useSecuredFinance';
import theme from '../../../../theme';
import { ordinaryFormat, percentFormat, usdFormat } from '../../../../utils';
import { Tabs } from '../../../../components/common/Tabs';
import { LendingTerminalStore } from '../../../../store/lendingTerminal';
import { RootState } from '../../../../store/types';
import { connect } from 'react-redux';

const MarketInfo: React.FC<LendingTerminalStore> = ({
    selectedCcy,
    termsIndex,
}) => {
    const marketTabs = ['Yield', 'Price'];
    const [selectedTab, setSelectedTab] = useState('Yield');
    const ethPrice = useEthereumUsd();
    const filPrice = useFilUsd();
    const lendingRates = useRates('FIL', 2);

    const handleSelectTab = (tab: React.SetStateAction<string>) => {
        setSelectedTab(tab);
    };

    const filToEthPrice = () => {
        const assetDelta = new BigNumber(filPrice.price).dividedBy(
            new BigNumber(ethPrice.price)
        );
        return assetDelta.toNumber();
    };

    const filToEthChange = () => {
        const changeDelta = new BigNumber(filPrice.change).minus(
            new BigNumber(ethPrice.change)
        );
        return changeDelta.toNumber();
    };

    return (
        <StyledMarketInfo>
            <StyledMarketInfoContainer>
                <StyledMarketSelector>
                    <StyledAssetTitle>FIL/ETH</StyledAssetTitle>
                    <ArrowSVG
                        width={'7'}
                        height='4'
                        rotate={0}
                        fill={theme.colors.gray}
                        stroke={theme.colors.gray}
                    />
                </StyledMarketSelector>
                <StyledMarketAssetInfo marginLeft={30}>
                    <StyledAssetInfoText>
                        {ordinaryFormat(filToEthPrice(), 6)}
                    </StyledAssetInfoText>
                    <StyledAssetInfoText
                        marginTop={1}
                        color={theme.colors.cellKey}
                        fontSize={theme.sizes.caption3}
                    >
                        {filPrice.price
                            ? usdFormat(filPrice.price, 2)
                            : usdFormat(0)}
                    </StyledAssetInfoText>
                </StyledMarketAssetInfo>
                <StyledDivider />
                <StyledMarketAssetInfo>
                    <StyledAssetInfoText
                        color={theme.colors.cellKey}
                        fontSize={theme.sizes.caption3}
                    >
                        24hr Change
                    </StyledAssetInfoText>
                    {filPrice.change < 0 ? (
                        <StyledAssetInfoText
                            marginTop={3}
                            color={theme.colors.red3}
                            fontSize={theme.sizes.caption3}
                        >
                            {percentFormat(filPrice.change)}
                        </StyledAssetInfoText>
                    ) : (
                        <StyledAssetInfoText
                            marginTop={3}
                            color={theme.colors.green}
                            fontSize={theme.sizes.caption3}
                        >
                            {percentFormat(filPrice.change)}
                        </StyledAssetInfoText>
                    )}
                </StyledMarketAssetInfo>
                <StyledMarketAssetInfo marginLeft={15}>
                    <StyledAssetInfoText
                        color={theme.colors.cellKey}
                        fontSize={theme.sizes.caption3}
                    >
                        Current Yield
                    </StyledAssetInfoText>
                    <StyledAssetInfoText
                        marginTop={3}
                        color={theme.colors.green}
                        fontSize={theme.sizes.caption3}
                    >
                        {lendingRates && lendingRates.length > 0
                            ? percentFormat(lendingRates[termsIndex], 10000)
                            : percentFormat(0)}
                    </StyledAssetInfoText>
                </StyledMarketAssetInfo>
                <StyledMarketAssetInfo marginLeft={15}>
                    <StyledAssetInfoText
                        color={theme.colors.cellKey}
                        fontSize={theme.sizes.caption3}
                    >
                        1yr Yield
                    </StyledAssetInfoText>
                    <StyledAssetInfoText
                        marginTop={3}
                        fontSize={theme.sizes.caption3}
                    >
                        {lendingRates && lendingRates.length > 0
                            ? percentFormat(lendingRates[2], 10000)
                            : percentFormat(0)}
                    </StyledAssetInfoText>
                </StyledMarketAssetInfo>
                <StyledMarketAssetInfo marginLeft={15}>
                    <StyledAssetInfoText
                        color={theme.colors.cellKey}
                        fontSize={theme.sizes.caption3}
                    >
                        3yr Yield
                    </StyledAssetInfoText>
                    <StyledAssetInfoText
                        marginTop={3}
                        fontSize={theme.sizes.caption3}
                    >
                        {lendingRates && lendingRates.length > 0
                            ? percentFormat(lendingRates[4], 10000)
                            : percentFormat(0)}
                    </StyledAssetInfoText>
                </StyledMarketAssetInfo>
                <StyledMarketAssetInfo marginLeft={15}>
                    <StyledAssetInfoText
                        color={theme.colors.cellKey}
                        fontSize={theme.sizes.caption3}
                    >
                        5yr Yield
                    </StyledAssetInfoText>
                    <StyledAssetInfoText
                        marginTop={3}
                        fontSize={theme.sizes.caption3}
                    >
                        {lendingRates && lendingRates.length > 0
                            ? percentFormat(lendingRates[5], 10000)
                            : percentFormat(0)}
                    </StyledAssetInfoText>
                </StyledMarketAssetInfo>
            </StyledMarketInfoContainer>
            <MarketTabsContainer>
                <Tabs
                    selectedTab={selectedTab}
                    options={marketTabs}
                    onClick={handleSelectTab}
                    style={{ fontWeight: 500, fontSize: theme.sizes.caption5 }}
                />
            </MarketTabsContainer>
        </StyledMarketInfo>
    );
};

const StyledMarketInfo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid ${theme.colors.darkenedBg};
`;

const StyledMarketInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const StyledMarketSelector = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const StyledAssetTitle = styled.p`
    font-size: ${props => props.theme.sizes.caption2}px;
    margin-right: ${props => props.theme.spacing[1] - 1}px;
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 600;
    color: ${props => props.theme.colors.white};
`;

interface StyledMarketAssetInfoProps {
    marginLeft?: number;
}

const StyledMarketAssetInfo = styled.div<StyledMarketAssetInfoProps>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
`;

interface StyledAssetInfoTextProps {
    color?: string;
    fontSize?: number;
    marginBottom?: number;
    marginTop?: number;
}

const StyledAssetInfoText = styled.p<StyledAssetInfoTextProps>`
    margin: 0;
    color: ${props =>
        props.color ? props.color : props.theme.colors.lightBackground};
    font-size: ${props =>
        props.fontSize ? props.fontSize : props.theme.sizes.caption2}px;
    margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
`;
const StyledDivider = styled.hr`
    margin: 0;
    width: 26px;
    transform: rotate(-90deg);
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    border-top: 1px solid ${props => props.theme.colors.darkenedBg};
`;

const MarketTabsContainer = styled(StyledMarketInfoContainer)`
    width: 110px;
    font-weight: 500;
`;

const mapStateToProps = (state: RootState) => state.lendingTerminal;
export default connect(mapStateToProps)(MarketInfo);
