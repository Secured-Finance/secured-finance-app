import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        Lending
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/exchange">
        Terminal
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/history">
        History
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.lightText};
  font-weight: 500;
  font-size: 16px;
  padding-top: ${(props) => props.theme.topBarPadding}px;
  padding-bottom: ${(props) => props.theme.topBarPadding}px;
  width: 150px;
  text-align: center;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.colors.grey};
    // font-weight:600;
  }
  &.active {
    background-color: ${(props) => props.theme.colors.darkenedBg};
    font-weight:600;
  }
  @media (max-width: 400px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`

export default Nav
