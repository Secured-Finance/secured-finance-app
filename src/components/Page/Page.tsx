import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

interface PageProps {
  children?: React.ReactNode
  padding?: number
}

const Page: React.FC<PageProps> = ({ children, padding }) => {
  return <StyledPage padding={padding}>{children}</StyledPage>
}

interface StyledPageProps {
  padding?: number
}

const StyledPage = styled.div<StyledPageProps>`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.padding ?? 0};
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`

export default Page
