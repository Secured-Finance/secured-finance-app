import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { validateMnemonic } from 'bip39';
import { isPrivate } from 'tiny-secp256k1';
import isBase64 from 'validator/lib/isBase64';
import useFilWasm from '../../../hooks/useFilWasm';
import {
    HDWallet,
    PKWallet,
    TestNetPath,
    useNewFilWalletProvider,
} from '../../../services/filecoin';
import theme from '../../../theme';
import Button from '../../Button';
import Modal, { ModalProps } from '../../Modal';
import ModalActions from '../../ModalActions';
import ModalContent from '../../ModalContent';
import ModalTitle from '../../ModalTitle';
import Spacer from '../../Spacer';
import useModal from '../../../hooks/useModal';
import MnemonicModal from './MnemonicModal';
import Breaker from '../../Breaker';
import { Network } from '@glif/filecoin-address';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/types';

interface PrivateKeyContainerProps {
    selectedTab?: string;
}

type ContainerProps = ModalProps & PrivateKeyContainerProps;

const RenderPrivateKeyContainer: React.FC<ContainerProps> = ({
    onDismiss,
    selectedTab,
}) => {
    const [mnemonic, setMnemonic] = useState('');
    const [mnemonicAddr, setMnemonicAddr] = useState('');
    const [secretSet, setSecretSet] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [privateKeyAddr, setPrivateKeyAddr] = useState('');
    const { keyDerive, keyRecover, filProviders } = useFilWasm();
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    let handleSave: () => void;
    let placeholder: string;
    let secret: string;
    let handleChange: (data: string) => void;

    const handleChangeMnemonic = useCallback(
        (data: string) => {
            setMnemonic(data);
            filAddressFromMnemonic(data);
        },
        [setMnemonic, setMnemonicAddr]
    );

    const handleChangePrivateKey = useCallback(
        (data: string) => {
            setPrivateKey(data);
            filAddressFromPrivateKey(data);
        },
        [setPrivateKey, setPrivateKeyAddr]
    );

    const filAddressFromMnemonic = useCallback(
        (data: string) => {
            if (keyDerive && data != undefined) {
                const isMnemonic = validateMnemonic(data);
                if (isMnemonic) {
                    let key = keyDerive(data, TestNetPath, '');
                    setMnemonicAddr(key.address);
                    setSecretSet(true);
                } else {
                    setMnemonicAddr('');
                    setSecretSet(false);
                }
            }
        },
        [keyDerive, setSecretSet, setMnemonicAddr]
    );

    const filAddressFromPrivateKey = useCallback(
        (data: string) => {
            if (keyRecover && data != undefined && isBase64(data)) {
                const pkB64 = Buffer.from(data, 'base64');
                const isPKB64 = isPrivate(pkB64);
                if (isPKB64) {
                    let key = keyRecover(pkB64, true);
                    setPrivateKeyAddr(key.address);
                    setSecretSet(true);
                }
            } else {
                setPrivateKeyAddr('');
                setSecretSet(false);
            }
        },
        [keyRecover, setSecretSet, setPrivateKeyAddr]
    );

    const { onCreate } = useNewFilWalletProvider();

    const handleCreateFilHDWallet = useCallback(async () => {
        try {
            if (filProviders && mnemonic != '' && walletProvider == null) {
                const provider = await filProviders.HDWalletProvider(mnemonic);
                await onCreate(provider, HDWallet, Network.TEST);
            }
        } catch (e) {
            console.log(e);
        }
    }, [onCreate, filProviders, mnemonic, walletProvider]);

    const handleCreateFilPKWallet = useCallback(async () => {
        try {
            if (filProviders && privateKey != '' && walletProvider == null) {
                const provider = await filProviders.PrivateKeyProvider(
                    privateKey
                );
                await onCreate(provider, PKWallet, Network.TEST);
            }
        } catch (e) {
            console.log(e);
        }
    }, [onCreate, filProviders, privateKey, walletProvider]);

    const tabs = [
        {
            title: 'Private Key',
            filAddrFunc: filAddressFromPrivateKey,
            saveHook: handleCreateFilPKWallet,
            placeholder: 'Please enter your private key',
            handleChange: handleChangePrivateKey,
            secret: privateKey,
        },
        {
            title: 'Mnemonic',
            filAddrFunc: filAddressFromMnemonic,
            saveHook: handleCreateFilHDWallet,
            placeholder: 'Please enter your 24 word mnemonic phrase',
            handleChange: handleChangeMnemonic,
            secret: mnemonic,
        },
    ];

    tabs.filter((tab, i) => {
        if (selectedTab == tab.title) {
            handleSave = tab.saveHook;
            placeholder = tab.placeholder;
            handleChange = tab.handleChange;
            secret = tab.secret;
        }
    });

    return (
        <div>
            <StyledLabel>{selectedTab}</StyledLabel>
            <StyledInputContainer>
                <StyledInput
                    placeholder={placeholder}
                    value={secret}
                    onChange={e => handleChange(e.target.value)}
                />
            </StyledInputContainer>
            <StyledAddressContainer>
                <StyledAddressTitle>Address</StyledAddressTitle>
                <StyledAddress>
                    {selectedTab == 'Mnemonic' ? mnemonicAddr : privateKeyAddr}
                </StyledAddress>
            </StyledAddressContainer>
            <Spacer size={'md'} />
            <StyledButtonContainer>
                <Button
                    onClick={handleSave}
                    text={'Import'}
                    style={{
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                    disabled={!secretSet}
                />
            </StyledButtonContainer>
            <Breaker />
        </div>
    );
};

const PrivateKeyModal: React.FC<ModalProps> = ({ onDismiss }) => {
    const [onMnemonicModal] = useModal(<MnemonicModal />);
    const ordersTabs = ['Private Key', 'Mnemonic'];
    const [selectedTab, setSelectedTab] = useState('Private Key');
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const handleSelectTab = (tab: React.SetStateAction<string>) => () => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        if (walletProvider) {
            onDismiss();
        }
    }, [walletProvider, onDismiss]);

    return (
        <Modal>
            <ModalTitle text='Import private key' />
            <ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledModalSubtitle>
                    Enter your mnemonic phrase or private key to import your
                    account.
                </StyledModalSubtitle>
                <StyledTabButtons>
                    {ordersTabs.map((tab, i) => (
                        <Button
                            key={i}
                            style={{
                                background: 'transparent',
                                color: theme.colors.lightText,
                                borderWidth: 1,
                                borderColor:
                                    selectedTab === tab
                                        ? theme.colors.darkBlue
                                        : 'transparent',
                                borderBottom:
                                    selectedTab === tab
                                        ? theme.colors.darkBlue
                                        : 'transparent',
                                textTransform: 'capitalize',
                                fontWeight: 500,
                                fontSize: 14,
                                outline: 'none',
                                height: 40,
                                borderRadius: 4,
                                marginRight: 0,
                                width: '120px',
                                textAlign: 'center',
                                paddingLeft: 18,
                                paddingRight: 18,
                            }}
                            onClick={handleSelectTab(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </StyledTabButtons>
                <RenderPrivateKeyContainer selectedTab={selectedTab} />
            </ModalContent>
            <ModalActions>
                <Button
                    text='Generate Mnemonic'
                    onClick={onMnemonicModal}
                    style={{
                        background: 'transparent',
                        borderWidth: 1,
                        borderColor: theme.colors.buttonBlue,
                        borderBottom: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                />
            </ModalActions>
        </Modal>
    );
};

const StyledModalSubtitle = styled.p`
    font-size: ${props => props.theme.sizes.subhead}px;
    color: ${props => props.theme.colors.lightText};
    text-align: center;
    margin: 0 0 ${props => props.theme.spacing[4]}px;
`;

const StyledLabel = styled.div`
    text-transform: capitalize;
    font-size: ${props => props.theme.sizes.subhead}px;
    margin-bottom: 5px;
    margin-top: 0px;
    font-weight: 500;
    color: ${props => (props.color ? props.color : props.theme.colors.gray)};
`;

const StyledInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`;

const StyledInput = styled.textarea`
    background-color: transparent;
    resize: none;
    padding: 0;
    min-height: 52px;
    max-height: 150px;
    font-weight: 500;
    font-family: 'Inter';
    color: ${props => props.theme.colors.lightText};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    font-size: ${props => props.theme.sizes.callout}px;
    outline: none;
    text-align: left;
    width: 100%;
    border: none;
`;

const StyledAddressContainer = styled.div`
    background: rgb(18, 39, 53, 0.7);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    border-top: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`;

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledAddressTitle = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.gray};
    font-size: ${props => props.theme.sizes.footnote}px;
`;

const StyledAddress = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.gray};
    font-size: ${props => props.theme.sizes.footnote}px;
`;

const StyledTabButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-transform: uppercase;
    padding: 0;
    margin-bottom: 20px;
`;

export default PrivateKeyModal;
