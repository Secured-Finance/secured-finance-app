import React, { useCallback } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import EthWallet from './components/EthWallet'
import FilWallet from './components/FilWallet'

const WalletModal: React.FC<ModalProps> = ({ onDismiss, ccyIndex }) => {

	return (
		<Modal>
			<ModalTitle text="Wallet Information" />
			<ModalContent>
				{
					ccyIndex == 1 
					?
					<FilWallet onDismiss={onDismiss}/>
					:
					<EthWallet onDismiss={onDismiss}/>
				}
			</ModalContent>
			<ModalActions>
				<Button 
					onClick={onDismiss} 
					text="Close" 
					style={{
						background: 'transparent',
						borderWidth: 1,
						borderColor: theme.colors.buttonBlue,
						borderBottom: theme.colors.buttonBlue,
						fontSize: theme.sizes.callout, 
						fontWeight: 500,
						color: theme.colors.white
					}}
				/>
			</ModalActions>
		</Modal>
	)
}

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

export default WalletModal
