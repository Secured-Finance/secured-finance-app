import styled from 'styled-components';
import React, { useCallback, useEffect, useState } from 'react';
import Modal, { ModalProps } from '../../Modal';
import ModalTitle from '../../ModalTitle';
import ModalActions from '../../ModalActions';
import { Button } from '../../common/Buttons';
import theme from '../../../theme';

const LedgerModal: React.FC<ModalProps> = () => {
    return (
        <Modal>
            <ModalTitle text='Connect' />
            <Content>Please connect your Ledger to your computer</Content>
            <ButtonsContainer>
                <Button outline>Back</Button>
                <Button>Yes, my device is connected</Button>
            </ButtonsContainer>
        </Modal>
    );
};

const Content = styled.div`
    padding: ${theme.spacing[7]}px ${theme.spacing[4]}px;
    color: ${theme.colors.cellKey};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${theme.spacing[4]}px;
`;

export default LedgerModal;
