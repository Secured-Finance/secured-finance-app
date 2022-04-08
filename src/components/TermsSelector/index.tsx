import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';
import { Terms, terms } from '../../utils/terms';
import ArrowSVG from '../ArrowSVG';

interface TermsSelectorProps {
    selectedTerm: string;
    style?: StyledTermsSelectorProps;
    onClick?: () => void;
    disabled?: boolean;
    noIcon?: boolean;
}

interface StyledTermsSelectorProps {
    color?: string;
    background?: string;
    fontSize?: number;
    marginRight?: number;
    marginLeft?: number;
    marginTop?: number;
    marginBottom?: number;
    fontWeight?: number;
}

interface TermsListProps {
    terms: Array<Terms>;
}

type ChildrenProps = TermsSelectorProps & TermsListProps;

const RenderText: React.FC<ChildrenProps> = ({ selectedTerm, terms }) => {
    let text: string;

    terms.filter((term, i) => {
        if (selectedTerm === term.term) {
            text = term.text;
        }
    });

    return <StyledTermsText marginLeft={'0px'}>{text}</StyledTermsText>;
};

const CurrencySelector: React.FC<TermsSelectorProps> = ({
    selectedTerm,
    onClick,
    style,
    disabled,
    noIcon,
}) => {
    return (
        <StyledTermsSelector
            disabled={disabled}
            onClick={onClick}
            color={style?.color ? style?.color : theme.colors.white}
            background={style?.background ? style?.background : 'transparent'}
            marginBottom={style?.marginBottom}
            marginTop={style?.marginTop}
            marginLeft={style?.marginLeft}
            marginRight={style?.marginRight}
            fontWeight={style?.fontWeight}
            fontSize={style?.fontSize}
        >
            <RenderText selectedTerm={selectedTerm} terms={terms} />
            {!noIcon ? (
                <StyledSVGContainer>
                    <ArrowSVG
                        width={'15'}
                        height='6'
                        rotate={0}
                        fill={theme.colors.white}
                        stroke={theme.colors.white}
                    />
                </StyledSVGContainer>
            ) : null}
        </StyledTermsSelector>
    );
};

const StyledTermsSelector = styled.button<StyledTermsSelectorProps>`
    min-width: 25%;
    background: transparent;
    outline: none;
    color: ${props => props.color};
    font-size: ${props =>
        props.fontSize ? props.fontSize : theme.sizes.body}px;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 500)};
    background-color: ${props => props.background};
    margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
    margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
`;

interface StyledTermTextProps {
    marginLeft?: string;
}

const StyledTermsText = styled.p<StyledTermTextProps>`
    margin: 0;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : '7px')};
    text-align: left;
`;

const StyledSVGContainer = styled.span`
    display: inline-block;
    margin-left: 2px;
`;

export default CurrencySelector;
