import React from 'react'
import styled from 'styled-components'

interface LabelProps {
    text?: string
    style?: StyledLabelProps
}

const Label: React.FC<LabelProps> = ({ text, style }) => (
    <StyledLabel
        marginTop={style?.marginTop}
        fontSize={style?.fontSize}
        fontWeight={style?.fontWeight}
        color={style?.color}
    >
        {text}
    </StyledLabel>
)

interface StyledLabelProps {
    fontSize?: number
    fontWeight?: number
    color?: string
    marginTop?: number
}

const StyledLabel = styled.div<StyledLabelProps>`
    font-size: ${props => props.fontSize ? props.fontSize : 14}px;
    font-weight: ${props => props.fontWeight ? props.fontWeight : 500};
    color: ${(props) => props.theme.colors.gray};
    margin-top: ${(props) => props.marginTop ? props.marginTop : 0}px;
`

export default Label
