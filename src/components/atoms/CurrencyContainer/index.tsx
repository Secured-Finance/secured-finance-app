import React from 'react';
import theme from 'src/theme';
import {
    CurrencyInfo,
    currencyList,
    getCurrencyBy,
} from 'src/utils/currencyList';
import styled from 'styled-components';

interface CurrencyContainerProps {
    ccy: string | number;
    size?: 'xs' | 'sm' | 'lg' | 'xl';
    short: boolean;
    wallet?: boolean;
    style?: StyledCurrencyProps;
}

interface StyledCurrencyProps {
    color?: string;
    fontSize?: number;
    marginLeft?: number;
    fontWeight?: number;
    alignItems?: string;
    justifyContent?: string;
}

interface CurrencyListProps {
    iconSize?: number;
    marginLeft?: number;
    fontSize?: number;
    currencies?: Array<CurrencyInfo>;
}

type ItemProps = CurrencyContainerProps & CurrencyListProps;

const CurrencyItem: React.FC<ItemProps> = ({
    ccy,
    iconSize,
    marginLeft,
    fontSize,
    short,
    wallet,
    currencies,
    style,
}) => {
    const { icon, shortName, fullName } = getCurrencyBy(
        'index',
        ccy.toString()
    );

    return (
        <div>
            {wallet ? (
                <StyledCurrency
                    alignItems={
                        style?.justifyContent ? style?.justifyContent : 'center'
                    }
                    justifyContent={
                        style?.justifyContent ? style?.justifyContent : 'center'
                    }
                >
                    <img width={40} height={40} src={icon} alt={shortName} />
                    <StyledWalletInfoContainer>
                        <StyledCurrencyText
                            color={
                                style?.color ? style?.color : theme.colors.white
                            }
                            marginLeft={
                                style?.marginLeft ? style?.marginLeft : 10
                            }
                            fontSize={
                                style?.fontSize
                                    ? style?.fontSize
                                    : theme.sizes.body
                            }
                            fontWeight={
                                style?.fontWeight ? style?.fontWeight : 500
                            }
                            alignItems={
                                style?.alignItems ? style?.alignItems : 'center'
                            }
                            justifyContent={
                                style?.justifyContent
                                    ? style?.justifyContent
                                    : 'center'
                            }
                        >
                            {fullName}
                        </StyledCurrencyText>
                        <StyledWalletSubtitle
                            marginLeft={
                                style?.marginLeft ? style?.marginLeft : 10
                            }
                            color={
                                style?.color ? style?.color : theme.colors.gray
                            }
                            fontSize={
                                style?.fontSize
                                    ? style?.fontSize
                                    : theme.sizes.caption
                            }
                            fontWeight={
                                style?.fontWeight ? style?.fontWeight : 400
                            }
                        >
                            {shortName}
                        </StyledWalletSubtitle>
                    </StyledWalletInfoContainer>
                </StyledCurrency>
            ) : (
                <StyledCurrency>
                    <img
                        width={iconSize}
                        height={iconSize}
                        src={icon}
                        alt={shortName}
                    />
                    <StyledCurrencyText
                        color={style?.color ? style?.color : theme.colors.white}
                        marginLeft={
                            style?.marginLeft ? style?.marginLeft : marginLeft
                        }
                        fontSize={style?.fontSize ? style?.fontSize : fontSize}
                        fontWeight={style?.fontWeight ? style?.fontWeight : 500}
                    >
                        {short ? shortName : fullName}
                    </StyledCurrencyText>
                </StyledCurrency>
            )}
        </div>
    );
};

export const CurrencyContainer: React.FC<CurrencyContainerProps> = ({
    ccy,
    size,
    short,
    wallet,
    style,
}) => {
    let iconSize: number;
    let fontSize: number;
    let marginLeft: number;

    switch (size) {
        case 'xs':
            iconSize = 12;
            fontSize = 10;
            marginLeft = 4;
            break;
        case 'sm':
            iconSize = 14;
            fontSize = 14;
            marginLeft = 2.5;
            break;
        case 'lg':
            iconSize = 28;
            fontSize = 16;
            marginLeft = 7;
            break;
        case 'xl':
            iconSize = 28;
            fontSize = 20;
            marginLeft = 8;
            break;
        default:
            iconSize = 14;
            fontSize = 14;
            break;
    }

    return (
        <CurrencyItem
            ccy={ccy}
            iconSize={iconSize}
            marginLeft={marginLeft}
            fontSize={fontSize}
            wallet={wallet}
            short={short}
            currencies={currencyList}
            style={style}
        />
    );
};

const StyledCurrency = styled.div<StyledCurrencyProps>`
    font-size: ${props => props.theme.sizes.subhead}px;
    align-items: ${props => props.alignItems};
    justify-content: ${props => props.justifyContent};
    display: flex;
    margin: 0 auto;
`;

const StyledCurrencyText = styled.div<StyledCurrencyProps>`
    font-size: ${props => props.fontSize}px;
    margin-left: ${props => props.marginLeft}px;
    color: ${props => props.color};
    font-weight: ${props => props.fontWeight};
`;

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledWalletSubtitle = styled.p<StyledCurrencyProps>`
    margin: 0;
    margin-left: ${props => props.marginLeft}px;
    margin-top: 2px;
    font-size: ${props => props.fontSize}px;
    color: ${props => props.color};
    font-weight: ${props => props.fontWeight};
`;
