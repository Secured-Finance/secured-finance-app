import styled from 'styled-components';
import React from 'react';
import Modal, { ModalProps } from '../../Modal';
import ModalTitle from '../../ModalTitle';
import { Button } from '../../common/Buttons';
import theme from '../../../theme';
import connectWithLedger from '../../../services/ledger/connectLedger';
import { useDispatch } from 'react-redux';

const getModalTextMap = (state: string) => {
    switch (state) {
        case 'hasDeviceConnectionError':
            return {
                title: 'Error',
                content: (
                    <>
                        <span>We couldn’t connect to your Ledger Device.</span>
                        <br />
                        <span>Please unlock your Ledger and try again.</span>
                    </>
                ),
            };
        case 'deviceIsConnected':
            return {
                title: 'Unlock and open',
                content:
                    'Please unlock your Ledger device and make sure the Filecoin App is open',
            };
        default:
            return {
                title: 'Connect',
                content: 'Please connect your Ledger to your computer',
            };
    }
};

const LedgerModal: React.FC<ModalProps & any> = ({ onClose }) => {
    const dispatch = useDispatch();
    const [contentState, setContentState] = React.useState('');

    const titleText = getModalTextMap(contentState).title;
    const content = getModalTextMap(contentState).content;

    const onConnectDevice = async () => {
        const x = await connectWithLedger(dispatch, {});

        if (!x) {
            setContentState('hasDeviceConnectionError');
        } else {
            setContentState('deviceIsConnected');
        }
    };

    return (
        <Modal>
            <ModalTitle text={titleText} />
            <Content>{content}</Content>
            <ButtonsContainer>
                <Button onClick={onClose} outline>
                    Close
                </Button>
                <Button onClick={onConnectDevice}>
                    Yes, my device is connected
                </Button>
            </ButtonsContainer>
        </Modal>
    );
};

const Content = styled.div`
    padding: ${theme.spacing[7]}px ${theme.spacing[4]}px 0;
    height: 84px;
    color: ${theme.colors.cellKey};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${theme.spacing[4]}px;
`;

export default LedgerModal;
