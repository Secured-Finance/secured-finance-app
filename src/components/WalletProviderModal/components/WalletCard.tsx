import React from 'react'
import theme from '../../../theme'
import Button from '../../Button'
import Card from '../../Card'
import CardContent from '../../CardContent'
import CardIcon from '../../CardIcon'
import CardTitle from '../../CardTitle'
import Spacer from '../../Spacer'

interface WalletCardProps {
  icon: React.ReactNode
  onConnect: () => void
  title: string
}

const WalletCard: React.FC<WalletCardProps> = ({ icon, onConnect, title }) => (
  <Card>
    <CardContent>
      <CardIcon>{icon}</CardIcon>
      <CardTitle text={title} />
      <Button 
        onClick={onConnect} 
        text="Connect" 
        style={{
          background: theme.colors.buttonBlue,
          fontSize: theme.sizes.callout, 
          fontWeight: 500,
          color: theme.colors.white
        }}
      />
    </CardContent>
  </Card>
)

export default WalletCard
