import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentWalletProviderModal] = useModal(
	<WalletProviderModal ccyIndex={0}/>,
	'provider',
  )

  const { account } = useWallet()

  const handleUnlockClick = useCallback(() => {
	onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
	<StyledAccountButton>
	  {!account ? (
		<Button size="sm" onClick={handleUnlockClick} text="Unlock Wallet" variant="blue"/>
		) : (
		<Button size="sm" to="/account" text="My Wallet" variant="blue"/>
	  )}
	</StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AccountButton
