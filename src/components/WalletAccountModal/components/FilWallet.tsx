import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import theme from '../../../theme'
import Button from '../../Button'
import Label from '../../Label'
import { ModalProps } from '../../Modal'
import Spacer from '../../Spacer'

const FilWallet: React.FC<ModalProps> = ({ onDismiss }) => {
	const { account, reset } = useWallet()

	const handleSignOutClick = useCallback(() => {
		onDismiss!()
		reset()
	}, [onDismiss, reset])

    return (
        <StyledWalletContainer>
            <div style={{ display: 'flex' }}>
            <StyledAccountContainer>
                <StyledAccount>
                        <StyledAccountText>{account}</StyledAccountText>
                        <Label 
                            style={{marginTop: 5}}
                            text="Filecoin address" 
                        />
                </StyledAccount>
            </StyledAccountContainer>
        </div>
        <StyledButtonContainer>
            <Button
                href={`https://etherscan.io/address/${account}`}
                text="View on Etherscan"
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