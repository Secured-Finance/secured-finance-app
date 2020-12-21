import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>

const StyledCard = styled.div`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.darkenedBg};
  border: 1px solid ${(props) => props.theme.colors.darkenedBg};
  border-radius: 12px;
  box-shadow: 1px 1px 10px ${(props) => props.theme.colors.darkenedBg};
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card
