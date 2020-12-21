import React, { useMemo } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import ArrowSVG from '../ArrowSVG'
import { Terms, terms } from '../../utils/terms'

interface TermsSelectorProps {
    selectedTerm: string
    onClick?: () => void
}

interface TermsListProps {
    terms: Array<Terms>
}

type ChildrenProps = TermsSelectorProps & TermsListProps

const RenderText: React.FC<ChildrenProps> = ({ selectedTerm, terms }) => {
    let text: string

    terms.filter((term, i) => {
        if (selectedTerm == term.term) {
            text = term.text
        }
    })

    return (
        <StyledTermsText marginLeft={'0px'}>{text}</StyledTermsText>
    )
}

const CurrencySelector: React.FC<TermsSelectorProps> = ({ selectedTerm, onClick }) => {

    return (
        <StyledTermsSelector
            onClick={onClick}
        >
            <RenderText selectedTerm={selectedTerm} terms={terms}/>
            <StyledSVGContainer>
                <ArrowSVG width={'15'} height="6" rotate={0} fill={theme.colors.white} stroke={theme.colors.white}/>
            </StyledSVGContainer>
        </StyledTermsSelector>
    )
}

const StyledTermsSelector = styled.button`
    min-width: 25%;
    background: transparent;
    outline: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
`

interface StyledTermTextProps {
    marginLeft?: string;
}

const StyledTermsText = styled.p<StyledTermTextProps>`
    margin: 0;
    margin-left: ${(props) => props.marginLeft ? props.marginLeft : '7px'};
    text-align: left;
`

const StyledSVGContainer = styled.span` display: inline-block; margin-left: 2px;`

export default CurrencySelector
