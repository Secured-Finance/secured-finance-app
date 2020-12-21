import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'

interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = () => {
    return (
        <StyledTopBar>
            <Container>
            <StyledTopBarInner>
                <StyledLogoWrapper>
                    <Logo />
                </StyledLogoWrapper>
                <Nav />
                <StyledAccountButtonWrapper>
                    <AccountButton />
                </StyledAccountButtonWrapper>
            </StyledTopBarInner>
            </Container>
        </StyledTopBar>
    )
}

const StyledLogoWrapper = styled.div`
    width: 190px;
    @media (max-width: 400px) {
        width: auto;
    }
`

const StyledTopBar = styled.div`
    border-bottom: 1px solid ${(props) => props.theme.colors.darkenedBg};
`

const StyledTopBarInner = styled.div`
    align-items: center;
    display: flex;
    height: ${(props) => props.theme.topBarSize}px;
    justify-content: space-between;
    width: 100%;
`

const StyledAccountButtonWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    width: 156px;
    @media (max-width: 400px) {
        justify-content: center;
        width: auto;
    }
`

export default NavBar
