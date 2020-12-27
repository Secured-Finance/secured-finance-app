import React, { useCallback, useEffect, useState } from 'react'
import { Network } from '@glif/filecoin-address'
import styled from 'styled-components'
import { useResetFilWalletProvider } from '../../../services/filecoin'
import theme from '../../../theme'
import Button from '../../Button'
import Label from '../../Label'
import { ModalProps } from '../../Modal'
import Spacer from '../../Spacer'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/types'

const FilWallet: React.FC<ModalProps> = ({ onDismiss }) => {
    const [address, setAddress] = useState<string>()
    const walletProvider = useSelector((state: RootState) => state.filWalletProvider.walletProvider);

    const getAddress = useCallback(() => {
        const accounts = walletProvider.wallet.getAccounts(0, 1, Network.TEST)
        .then((res) => {
            setAddress(res[0])
        })
        .catch((err) => console.log(err))
    }, [setAddress, walletProvider])

    const { onReset } = useResetFilWalletProvider()

	const handleSignOutClick = useCallback(() => {
        onDismiss!()
        onReset()
    }, [onDismiss])
    
    useEffect(()=> {
        if (walletProvider) {
            getAddress();
		}
    }, [walletProvider, getAddress])

    return (
        <StyledWalletContainer>
            <div style={{ display: 'flex' }}>
            <StyledAccountContainer>
                <StyledAccount>
                        <StyledAccountText>{address}</StyledAccountText>
                        <Label 
                            style={{marginTop: 5}}
                            text="Filecoin address" 
                        />
                </StyledAccount>
            </StyledAccountContainer>
        </div>
        <StyledButtonContainer>
            <Button
                href={`https://filscan.io/#/tipset/address-detail?address=${address}`}
                text="View on Filscan"
                style={{
                    background: theme.colors.buttonBlue,
                    fontSize: theme.sizes.callout, 
                    fontWeight: 500,	
                    color: theme.colors.white
                }}
            />
            <Spacer />
            <Button
                onClick={handleSignOutClick}
                text="Sign out"
                style={{
                    background: theme.colors.buttonBlue,
                    fontSize: theme.sizes.callout, 
                    fontWeight: 500,	
                    color: theme.colors.white
                }}
            />
        </StyledButtonContainer>
    </StyledWalletContainer>
    )
}

const StyledWalletContainer = styled.div`

`

const StyledAccount = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
`

const StyledAccountContainer = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const StyledAccountText = styled.p`
	margin: 0;
	color: ${props => props.theme.colors.lightText};
	font-size: ${props => props.theme.sizes.callout};
`

const StyledButtonContainer = styled.div`
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

export default FilWallet