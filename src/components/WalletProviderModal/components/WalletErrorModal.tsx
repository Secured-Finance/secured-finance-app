import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import Button from '../../Button'
import Modal, { ModalProps } from '../../Modal'
import ModalActions from '../../ModalActions'
import ModalContent from '../../ModalContent'
import ModalTitle from '../../ModalTitle'

const WalletErrorModal: React.FC<ModalProps> = ({ onDismiss }) => {
	return (
		<Modal>
			<ModalTitle text="Connection error" />
			<ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledModalSubtitle>Unsupported network, please use Ropsten (Chain ID: 3)</StyledModalSubtitle>
			</ModalContent>
			<ModalActions>
				<Button 
					text="Close" 
					onClick={onDismiss} 
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

const StyledModalSubtitle = styled.p`
    font-size: ${(props) => props.theme.sizes.subhead}px;
    color: ${(props) => props.theme.colors.lightText};
    text-align: center;
    margin: 0 0 ${(props) => props.theme.spacing[4]}px;
`

export default WalletErrorModal
