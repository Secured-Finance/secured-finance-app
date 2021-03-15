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

  // Next line causes BUG with page contents going over the nav-bar
  // when browser window is resized (height made smaller)
  // height: 100%;
  margin-top: 10vh;

  align-items: center;
  display: flex;
  flex-direction: column;
`

export default Page
