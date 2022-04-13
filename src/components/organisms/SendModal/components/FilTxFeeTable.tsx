import { useSelector } from 'react-redux';
import { getMaxTxFee } from 'src/store/sendForm/selectors';
import styled from 'styled-components';
import theme from 'src/theme';

export const FilTxFeeTable = () => {
    const maxTxFee = Number(useSelector(getMaxTxFee).toFil());
    if (maxTxFee > 0) {
        return (
            <StyledText>
                You will not pay more than {maxTxFee.toFixed(18)} FIL for this
                transaction.{' '}
                <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://filfox.info/en/stats/gas'
                >
                    More information on average gas fee statistics.
                </a>
            </StyledText>
        );
    }
    return null;
};

const StyledText = styled.div`
    color: ${theme.colors.gray};
    font-size: ${theme.sizes.subhead}px;
`;
