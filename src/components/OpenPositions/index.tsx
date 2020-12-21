import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../theme';
import Button from '../Button';
import PositionsTable from './PositionsTable';

interface OpenPositionsProps {
}

const OpenPositions: React.FC<OpenPositionsProps> = () => {
    const ordersTabs = ["Open Positions", "Trading History"];
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
                        background: selectedTab === tab ? '#0F1D25': 'transparent',
                        color: selectedTab === tab ? theme.colors.white : theme.colors.lightText,
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        fontSize: 14,
                        outline: "none",
                        height: 42,
                        borderRadius: 3,
                        marginRight: 5,
                        width: 'unset',
                        textAlign: "center",
                        paddingLeft: 18,
                        paddingRight: 18,
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
	margin-top: ${(props) => props.theme.sizes.body}px;
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
`

const StyledPositionTitle = styled.div`
	display: flex;
	flex-direction: row;
	text-transform: uppercase;
	font-size: ${(props) => props.theme.sizes.body}px;
	// margin-bottom: ${(props) => props.theme.sizes.caption3}px;
	padding: ${(props) => props.theme.sizes.body}px 0 0 0;
	font-weight: 500;
	text-align: left;
`

export default OpenPositions;