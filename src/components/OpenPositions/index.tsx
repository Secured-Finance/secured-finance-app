import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../theme';
import Button from '../Button';
import PositionsTable from './PositionsTable';

interface OpenPositionsProps {
}

const OpenPositions: React.FC<OpenPositionsProps> = () => {
    const ordersTabs = ["Open Positions", "Orders", "Trading History"];
    const [selectedTab, setSelectedTab] = useState("Open Positions")

    const handleChange = (tab: React.SetStateAction<string>) => () => {
        setSelectedTab(tab);
    };

    return (
        <StyledPositionsComponent>
        <StyledPositionTitle>
            {ordersTabs.map((tab, i) => (
                <Button
                    key={i}
                    style={{
                        background: selectedTab === tab ? theme.colors.background : 'transparent',
                        color: theme.colors.white,
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        fontSize: theme.sizes.caption2,
                        outline: "none",
                        height: 43,
                        borderRadius: 0.1,
                        marginRight: 0,
                        width: 'unset',
                        textAlign: "center",
                        paddingLeft: 20,
                        paddingRight: 20,
                    }}
                    onClick={handleChange(tab)}
                >
                    {tab}
                </Button>
            ))}
        </StyledPositionTitle>
        <PositionsTable />
        </StyledPositionsComponent>
    );
}

const StyledPositionsComponent = styled.div`
	border-top: 1px solid ${(props) => props.theme.colors.darkenedBg};
	display: flex;
	flex-direction: column;
`

const StyledPositionTitle = styled.div`
	display: flex;
	flex-direction: row;
	text-transform: uppercase;
    background: ${(props) => props.theme.colors.darkSection};
`

export default OpenPositions;