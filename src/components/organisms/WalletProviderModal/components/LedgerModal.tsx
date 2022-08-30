import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { Modal, ModalProps, ModalTitle } from 'src/components/legacy';
import connectWithLedger from 'src/services/ledger/connectLedger';
import { AppDispatch } from 'src/store';
import {
    isDeviceUnlocked,
    isUsedByAnotherApp,
} from 'src/store/ledger/selectors';
import theme from 'src/theme';
import styled from 'styled-components';

type ContentStates =
    | 'hasDeviceConnectionError'
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

const LedgerModal: React.FC<ModalProps & { onClose: () => void }> = ({
    onClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const isDeviceUsedByAnotherApp = useSelector(isUsedByAnotherApp);
    const isUnlocked = useSelector(isDeviceUnlocked);
    const [contentState, setContentState] =
        React.useState<ContentStates>('default');
    const { button, content, title } = modalTextMap[contentState];
    const [status, setStatus] = React.useState('');

    useEffect(() => {
        if (isDeviceUsedByAnotherApp) {
            setContentState('usedByAnotherApp');
        }
    }, [isDeviceUsedByAnotherApp]);

    useEffect(() => {
        if (!isUnlocked && status === 'ledgerConnected') {
            return setContentState('hasDeviceConnectionError');
        }
    }, [status, isUnlocked]);

    const onConnectDevice = async () => {
        if (isDeviceUsedByAnotherApp)
            return setContentState('usedByAnotherApp');

        setContentState('loading');
        const provider = await connectWithLedger(dispatch);
        setStatus('ledgerConnected');

        if (provider) onClose();
    };

    return (
        <Modal>
            <ModalTitle text={title} />
            <Content>{content}</Content>
            <ButtonsContainer>
                <Button onClick={onClose}>Close</Button>
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
