import { validateMnemonic } from 'bip39';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Breaker,
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalProps,
    ModalTitle,
    Spacer,
} from 'src/components/atoms';
import useFilWasm from 'src/hooks/useFilWasm';
import useModal from 'src/hooks/useModal';
import { TestNetPath, useNewFilWalletProvider } from 'src/services/filecoin';
import { FilecoinWalletType } from 'src/services/filecoin/store/types';
import { getFilecoinNetwork } from 'src/services/filecoin/utils';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import { toKebabCase } from 'src/utils';
import styled from 'styled-components';
import { isPrivate } from 'tiny-secp256k1';
import isBase64 from 'validator/lib/isBase64';
import MnemonicModal from './MnemonicModal';

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

    const filAddressFromMnemonic = useCallback(
        (data: string) => {
            if (keyDerive && data !== undefined) {
                const isMnemonic = validateMnemonic(data);
                if (isMnemonic) {
                    const key = keyDerive(data, TestNetPath, '');
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
            if (keyRecover && data && isBase64(data)) {
                const pkB64 = Buffer.from(data, 'base64');
                const isPKB64 = isPrivate(pkB64);
                if (isPKB64) {
                    const key = keyRecover(pkB64, true);
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
            if (filProviders && mnemonic !== '' && walletProvider == null) {
                const provider = await filProviders.HDWalletProvider(mnemonic);
                await onCreate(
                    provider,
                    FilecoinWalletType.HDWallet,
                    getFilecoinNetwork()
                );
            }
        } catch (e) {
            console.log(e);
        }
    }, [onCreate, filProviders, mnemonic, walletProvider]);

    const handleCreateFilPKWallet = useCallback(async () => {
        try {
            if (filProviders && privateKey !== '' && walletProvider == null) {
                const provider = await filProviders.PrivateKeyProvider(
                    privateKey
                );
                await onCreate(
                    provider,
                    FilecoinWalletType.PKWallet,
                    getFilecoinNetwork()
                );
            }
        } catch (e) {
            console.log(e);
        }
    }, [onCreate, filProviders, privateKey, walletProvider]);

    const handleChangeMnemonic = useCallback(
        (data: string) => {
            setMnemonic(data);
            filAddressFromMnemonic(data);
        },
        [filAddressFromMnemonic]
    );

    const handleChangePrivateKey = useCallback(
        (data: string) => {
            setPrivateKey(data);
            filAddressFromPrivateKey(data);
        },
        [filAddressFromPrivateKey]
    );

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

    for (const tab of tabs) {
        if (tab.title === selectedTab) {
            handleSave = tab.saveHook;
            placeholder = tab.placeholder;
            handleChange = tab.handleChange;
            secret = tab.secret;
        }
    }

    return (
        <div>
            <StyledLabel>{selectedTab}</StyledLabel>
            <StyledInputContainer>
                <StyledInput
                    id={`${toKebabCase(selectedTab)}-input`}
                    placeholder={placeholder}
                    value={secret}
                    onChange={e => handleChange(e.target.value)}
                />
            </StyledInputContainer>
            <StyledAddressContainer>
                <StyledAddressTitle>Address</StyledAddressTitle>
                <StyledAddress data-cy='address'>
                    {selectedTab === 'Mnemonic' ? mnemonicAddr : privateKeyAddr}
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
