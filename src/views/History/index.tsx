import { Container } from 'src/components/atoms';
import { CollateralTab } from 'src/components/organisms/CollateralTab';
import { useBorrowDeals, useLoanDeals } from 'src/hooks/useLoanHistory';
import styled from 'styled-components';
import { HistoryTable } from './components';

const History = () => {
    const loans = useLoanDeals();
    const borrows = useBorrowDeals();

    return (
        <div role='main'>
            <Container>
                {loans.length === 0 ? null : (
                    <div>
                        <StyledHistoryTitleContainer>
                            <StyledHistoryTitle>
                                Lending history
                            </StyledHistoryTitle>
                        </StyledHistoryTitleContainer>
                        <StyledHistoryContainer>
                            <HistoryTable table={loans} />
                        </StyledHistoryContainer>
                    </div>
                )}
                {borrows.length === 0 ? null : (
                    <div>
                        <StyledHistoryTitleContainer>
                            <StyledHistoryTitle>
                                Borrowing history
                            </StyledHistoryTitle>
                        </StyledHistoryTitleContainer>
                        <StyledHistoryContainer>
                            <HistoryTable table={borrows} />
                        </StyledHistoryContainer>
                    </div>
                )}
                <CollateralTab />
            </Container>
        </div>
    );
};

const StyledHistoryTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: ${props => props.theme.spacing[5]}px;
    padding-bottom: ${props => props.theme.spacing[5]}px;
    padding-left: ${props => props.theme.spacing[5]}px;
    padding-right: ${props => props.theme.spacing[5]}px;
`;

const StyledHistoryTitle = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: ${props => props.theme.sizes.h1}px;
    color: ${props => props.theme.colors.white};
    margin: 0px;
`;

const StyledHistoryContainer = styled.div`
    padding-left: ${props => props.theme.spacing[5]}px;
    padding-right: ${props => props.theme.spacing[5]}px;
`;

export default History;
