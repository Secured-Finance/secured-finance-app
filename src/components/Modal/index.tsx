import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface ModalProps {
    onDismiss?: () => void;
    ccyIndex?: number;
}

const Modal: React.FC = ({ children }) => {
    return (
        <StyledResponsiveWrapper>
            <StyledModal>{children}</StyledModal>
        </StyledResponsiveWrapper>
    );
};

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const StyledResponsiveWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
        flex: 1;
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        max-height: calc(100% - ${props => props.theme.spacing[4]}px);
        animation: ${mobileKeyframes} 0.3s forwards ease-out;
    }
`;

const StyledModal = styled.div`
    padding: 0 20px;
    background: ${props => props.theme.colors.background};
    // border: 1px solid ${props => props.theme.colors.lightGray}ff;
    border-radius: 12px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: relative;
    width: 645px;
    min-height: 0;
    max-width: 645px;
`;

export default Modal;
