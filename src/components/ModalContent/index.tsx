import React from 'react'
import styled from 'styled-components'

interface ModalContentProps {
	paddingTop?: string
	paddingBottom?: string
	paddingLeft?: string
	paddingRight?: string
}

const ModalContent: React.FC<ModalContentProps> = ({ children, paddingTop, paddingBottom, paddingLeft, paddingRight }) => {
  return <StyledModalContent paddingTop={paddingTop} paddingBottom={paddingBottom} paddingLeft={paddingLeft} paddingRight={paddingRight}>{children}</StyledModalContent>
}

const StyledModalContent = styled.div<ModalContentProps>`
  padding-bottom: ${(props) => props.paddingBottom ? props.paddingBottom : props.theme.spacing[4]+"px"};
  padding-top: ${(props) => props.paddingTop ? props.paddingTop : props.theme.spacing[4]+"px"};
  padding-left: ${(props) => props.paddingLeft ? props.paddingLeft : props.theme.spacing[4]+"px"};
  padding-right: ${(props) => props.paddingRight ? props.paddingRight : props.theme.spacing[4]+"px"};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
	flex: 1;
	overflow: auto;
  }
`

export default ModalContent
