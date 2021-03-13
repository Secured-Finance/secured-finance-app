import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

interface PageProps {
  children?: React.ReactNode
  padding?: number
}

const Page: React.FC<PageProps> = ({ children, padding }) => {
  const theme = useContext(ThemeContext)
  return (
    <StyledPage background={theme.background} padding={padding}>
      <StyledMain>{children}</StyledMain>
    </StyledPage>
  )
}

interface StyledPageProps {
  background: string
  padding?: number
}

const StyledPage = styled.div<StyledPageProps>`
  background-color: ${props => props.background};
  padding-bottom: ${props => props.padding};
  padding-top: ${props => props.padding};
  padding-left: ${props => props.padding};
  padding-right: ${props => props.padding};
`

const StyledMain = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - ${props => props.theme.topBarSize}px);
`

export default Page
