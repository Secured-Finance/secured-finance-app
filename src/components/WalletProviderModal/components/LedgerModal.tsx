import styled from 'styled-components';
import React, { useEffect } from 'react';
import Modal, { ModalProps } from '../../Modal';
import ModalTitle from '../../ModalTitle';
import { Button } from '../../common/Buttons';
import theme from '../../../theme';
import { useDispatch, useSelector } from 'react-redux';
import {
    isUsedByAnotherApp,
    isDeviceUnlocked,
} from '../../../store/ledger/selectors';
import fetchDefaultWallet from '../../../services/ledger/fetchDefaultWallet';
import connectWithLedger from '../../../services/ledger/connectLedger';

type ContentStates =
    | 'hasDeviceConnectionError'
    | 'deviceIsConnected'
    | 'usedByAnotherApp'
    | 'loading'
    | 'default';

const modalTextMap = {
    hasDeviceConnectionError: {
        title: 'Connection error',
        content: (
            <>
                <span>We couldn’t connect to your Ledger Device.</span>
                <br />
                <span>
                    Please unlock your Ledger, make sure Filecoin app is open
                    and try again.
                </span>
            </>
        ),
        button: 'Try again',
    },
    deviceIsConnected: {
        title: 'Unlock and open',
        content:
            'Please unlock your Ledger device and make sure the Filecoin App is open',
        button: 'My device is unlocked and Filecoin app is open',
    },
    usedByAnotherApp: {
        title: 'Device is used by another app',
        content: (
            <>
                <span>
                    Looks like another app is connected to your Ledger device.
                </span>
                <br />
                <span>
                    Please, disconnect the device from every other app and try
                    again
                </span>
            </>
        ),
        button: 'Try again',
    },
    loading: {
        title: 'Please wait',
        content: 'Loading...',
        button: 'Loading',
    },
    default: {
        title: 'Connect',
        content: 'Please connect your Ledger to your computer',
        button: 'Yes, my device is connected',
    },
};

const LedgerModal: React.FC<ModalProps & any> = ({ onClose }) => {
    const dispatch = useDispatch();
    const isDeviceUsedByAnotherApp = useSelector(isUsedByAnotherApp);
    const isUnlocked = useSelector(isDeviceUnlocked);
    const [contentState, setContentState] =
        React.useState<ContentStates>('default');
    const { button, content, title } = modalTextMap[contentState];

    useEffect(() => {
        if (isDeviceUsedByAnotherApp) {
            setContentState('usedByAnotherApp');
        }
    }, [isDeviceUsedByAnotherApp]);

    useEffect(() => {
        connectWithLedger(dispatch);
    }, []);

    const onConnectDevice = async () => {
        if (isDeviceUsedByAnotherApp)
            return setContentState('usedByAnotherApp');

        if (contentState === 'deviceIsConnected') {
            if (!isUnlocked) return setContentState('hasDeviceConnectionError');

            setContentState('loading');
            if (await fetchDefaultWallet(dispatch)) onClose();
        } else {
            setContentState('deviceIsConnected');
        }
    };

    return (
        <Modal>
            <ModalTitle text={title} />
            <Content>{content}</Content>
            <ButtonsContainer>
                <Button onClick={onClose} outline>
                    Close
                </Button>
                <Button
                    disabled={contentState === 'loading'}
                    onClick={onConnectDevice}
                >
                    {button}
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
