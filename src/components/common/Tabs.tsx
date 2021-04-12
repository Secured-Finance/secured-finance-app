import React, {HTMLAttributes} from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import {Subheader} from "./Subheader"

interface ITab {
    isActive: boolean,
    onClick: () => void
}

interface ITabs {
    options: Array<string>,
    selectedTab: string,
    onClick: (tabName: string) => void,
    style?: React.CSSProperties,
}

const Tab = styled.div<ITab>`
  color: ${({isActive}) => isActive ? theme.colors.lightBackground : theme.colors.cellKey};
  background-color: ${({isActive}) => isActive ? theme.colors.darkenedBg : 'transparent'};
  border-radius: ${({isActive}) => isActive ? '4px' : 0};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 9.5px 0 10.5px 0;
  cursor: pointer;
`

const TabsContainer = styled.div`
  display: flex;
  flex: 1 0 100%;
`

export const Tabs: React.FC<ITabs> = ({options, selectedTab, onClick, style}) => {

    return <TabsContainer>{
        options.map((tabName, i) => <Tab key={i} isActive={tabName === selectedTab} onClick={() => onClick(tabName)}>
            <Subheader style={{...style, margin: 0, color: 'inherit'}}>{tabName}
            </Subheader>
        </Tab>)
    }</TabsContainer>
}