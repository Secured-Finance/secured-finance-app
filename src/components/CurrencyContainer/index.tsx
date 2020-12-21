import React from 'react'
import styled from 'styled-components'
import { currencyList, CurrencyInfo } from '../../utils/currencies'
import theme from '../../theme'

interface CurrencyContainerProps {
    index: any,
    size?: 'sm' | 'lg' | 'xl',
    short: boolean,
    wallet?: boolean,
    style?: StyledCurrencyProps
}

interface StyledCurrencyProps {
    color?: string,
	fontSize?: number,
    marginLeft?: number,
    fontWeight?: number,
}

interface CurrencyListProps {
    iconSize?: number,
    marginLeft?: number,
    fontSize?: number,
    currencies?: Array<CurrencyInfo>,
}

type ItemProps = CurrencyContainerProps & CurrencyListProps

const CurrencyItem: React.FC<ItemProps> = ({index, iconSize, marginLeft, fontSize, short, wallet, currencies, style}) => {
    let icon: string
    let shortName: string
    let fullName: string

    currencies.filter((currency, i) => {
        if (index == i) {
            icon = currency.icon
            shortName = currency.shortName
            fullName = currency.fullName
        }
    })

    return (
        <div>
        {
            wallet
            ?
            <StyledCurrency>
                <img width={40} height={40} src={icon}/>
                <StyledWalletInfoContainer>
                    <StyledCurrencyText 
                        color={style?.color ? style?.color : theme.colors.white}
                        marginLeft={style?.marginLeft ? style?.marginLeft : 10}
                        fontSize={style?.fontSize ? style?.fontSize : theme.sizes.body}
                        fontWeight={style?.fontWeight ? style?.fontWeight : 500}
                    >{fullName}</StyledCurrencyText>
                    <StyledWalletSubtitle
                        marginLeft={style?.marginLeft ? style?.marginLeft : 10}
                        color={style?.color ? style?.color : theme.colors.gray}
                        fontSize={style?.fontSize ? style?.fontSize : theme.sizes.caption}
                        fontWeight={style?.fontWeight ? style?.fontWeight : 400}
                    >{shortName}</StyledWalletSubtitle>
                </StyledWalletInfoContainer>
            </StyledCurrency>
            :
            <StyledCurrency>
                <img width={iconSize} height={iconSize} src={icon}/>
                    <StyledCurrencyText 
                        color={style?.color ? style?.color : theme.colors.white}
                        marginLeft={style?.marginLeft ? style?.marginLeft : marginLeft}
                        fontSize={style?.fontSize ? style?.fontSize : fontSize}
                        fontWeight={style?.fontWeight ? style?.fontWeight : 500}
                    >{short ? shortName : fullName}</StyledCurrencyText>
            </StyledCurrency>
        }
        </div>
    )
}

const CurrencyContainer: React.FC<CurrencyContainerProps> = ({index, size, short, wallet, style}) => {

    let iconSize: number
    let fontSize: number
    let marginLeft: number

    switch (size) {
		case 'sm':
			iconSize = 14
            fontSize = 14
            marginLeft = 2.5
			break
		case 'lg':
			iconSize = 28
            fontSize = 16
            marginLeft = 7
            break
        case 'xl':
            iconSize = 28
            fontSize = 20
            marginLeft = 8
            break    
		default:
			iconSize = 14
            fontSize = 14
            break
    }
    
    return (
        <CurrencyItem 
            index={index}
            iconSize={iconSize}
            marginLeft={marginLeft}
            fontSize={fontSize}
            wallet={wallet}
            short={short}
            currencies={currencyList}
            style={style}
        />
    )
}

const StyledCurrency = styled.div`
    font-size: ${(props) => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`

const StyledCurrencyText = styled.div<StyledCurrencyProps>`
    font-size: ${(props) => props.fontSize}px;
    margin-left: ${(props) => props.marginLeft}px;
    color: ${(props) => props.color};
    font-weight: ${(props) => props.fontWeight};
`

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const StyledWalletSubtitle = styled.p<StyledCurrencyProps>`
    margin: 0;
    margin-left: ${(props) => props.marginLeft}px;
    margin-top: 2px;
    font-size: ${(props) => props.fontSize}px;
    color: ${(props) => props.color};
    font-weight: ${(props) => props.fontWeight};
`

export default CurrencyContainer
