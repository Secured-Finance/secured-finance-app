import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletAccountModal from '../../WalletAccountModal'
import WalletProviderModal from '../../WalletProviderModal'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<WalletAccountModal />)
  const [onPresentWalletProviderModal] = useModal(
	<WalletProviderModal />,
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
		<Button size="sm" onClick={onPresentAccountModal} text="My Wallet" variant="blue"/>
	  )}
	</StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AccountButton
