import React, {HTMLAttributes, useState} from 'react'
import styled  from 'styled-components'
import theme from '../../theme';
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
        <TableTabs>
            {ordersTabs.map((tab, i) => (
                <TableTab
                    key={i}
                    isSelected={selectedTab === tab}
                    onClick={handleChange(tab)}
                >
                    {tab}
                </TableTab>
            ))}
        </TableTabs>
        <PositionsTable />
        </StyledPositionsComponent>
    );
}

const StyledPositionsComponent = styled.div`
	border-top: 1px solid ${(props) => props.theme.colors.darkenedBg};
	display: flex;
	flex-direction: column;
`

const TableTabs = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.lightBackground};
  border-bottom: 1px solid ${theme.colors.darkenedBg};
`

interface ITableTab extends HTMLAttributes<HTMLDivElement> {
    isSelected: boolean,
}

const TableTab = styled.div<ITableTab>`
  color: ${(props) => props.isSelected ? theme.colors.lightBackground : theme.colors.cellKey };
  border-bottom: ${(props) => props.isSelected ? `2px solid${theme.colors.sfBlue900}` : ''};
  font-weight: 600;
  font-size: ${theme.sizes.footnote}px;
  padding: 15px 0;
  margin: 0 20px;
  cursor: ${(props) => props.isSelected ? 'default' : 'pointer' };
`

export default OpenPositions;