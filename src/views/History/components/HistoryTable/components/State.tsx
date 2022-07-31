import { Loan } from '@secured-finance/sf-graph-client/dist/graphclients';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const RenderAction = ({ loan }: { loan: Loan }) => {
    return (
        <div>
            {
                <StyledActionsContainer>
                    <StyledActionButton>
                        <StyledLink to={`/loan/${loan.id}`}>State</StyledLink>
                        {/* State */}
                    </StyledActionButton>
                </StyledActionsContainer>
            }
        </div>
    );
};

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

const StyledLink = styled(Link)`
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1;
    text-decoration: none;
`;

const StyledActionButton = styled.button`
    padding: 4px 10px;
    background-color: ${props => props.theme.colors.darkenedBg};
    color: ${props => props.theme.colors.blue};
    font-size: 13px;
    font-weight: 700;
    outline: none;
    border: none;
    border-radius: 15px;
`;

export default RenderAction;
