import { Network } from '@glif/filecoin-address';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useFilWasm from 'src/hooks/useFilWasm';
import useModal from 'src/hooks/useModal';
import { HDWallet, useNewFilWalletProvider } from 'src/services/filecoin';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import {
    Breaker,
    Button,
    Modal,
    ModalProps,
    ModalActions,
    ModalContent,
    ModalTitle,
    Spacer,
} from 'src/components/atoms';
import PrivateKeyModal from './PrivateKeyModal';

interface MnemonicProps {
    mnemonic: string;
}

const RenderMnemonic: React.FC<MnemonicProps> = ({ mnemonic }) => {
    const [mnemonicPhrase, setMnemonicPhrase] = useState([] as Array<string>);

    async function parseMnemonic() {
        if (mnemonic != null) {
            const parsedMnemonic = await mnemonic.split(' ');
            await setMnemonicPhrase(parsedMnemonic);
        }
    }

    useEffect(() => {
        parseMnemonic();
    }, [mnemonic, setMnemonicPhrase]);

    return (
        <StyledMnemonicContainer>
            {mnemonicPhrase.map((word, i) => {
                return <StyledWord key={i}>{word}</StyledWord>;
            })}
        </StyledMnemonicContainer>
    );
};

const MnemonicModal: React.FC<ModalProps> = ({ onDismiss }) => {
    const [onPrivateKeyModal] = useModal(<PrivateKeyModal />);
    const { loaded, generateMnemonic, filProviders } = useFilWasm();
    const [mnemonic, setMnemonic] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const genPhrase = useCallback(async () => {
        const phrase = await generateMnemonic();
        await setMnemonic(phrase);
        setIsLoading(true);
    }, [setMnemonic, setIsLoading, generateMnemonic]);

    useEffect(() => {
        let isMounted = true;
        if (walletProvider) {
            onDismiss();
        } else if (loaded && generateMnemonic) {
            genPhrase();
        }
        return () => {
            isMounted = false;
        };
    }, [loaded, generateMnemonic, setMnemonic, walletProvider, onDismiss]);

    const { onCreate } = useNewFilWalletProvider();

    const handleCreateFilHDWallet = useCallback(async () => {
        try {
            if (filProviders && mnemonic !== '' && walletProvider == null) {
                const provider = await filProviders.HDWalletProvider(mnemonic);
                await onCreate(provider, HDWallet, Network.TEST);
            }
        } catch (e) {
            console.log(e);
        }
    }, [onCreate, filProviders, mnemonic, walletProvider]);

    return (
        <Modal>
            <ModalTitle text='Mnemonic phrase' />
            <ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledModalSubtitle>
                    Your mnemonic phrase is the access key to all your
                    cryptocurrencies. Keep your mnemonic on a secure
                    environment. Without the phrase you will not be able to
                    recover your money.
                </StyledModalSubtitle>
                <RenderMnemonic mnemonic={mnemonic} />
                <Spacer size={'md'} />
                <StyledButtonContainer>
                    <Button
                        // onClick={saveProvider}
                        text={'Download'}
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
                    <Spacer size={'md'} />
                    <Button
                        onClick={handleCreateFilHDWallet}
                        text={'Save'}
                        style={{
                            background: theme.colors.buttonBlue,
                            fontSize: theme.sizes.callout,
                            fontWeight: 500,
                            color: theme.colors.white,
                        }}
                        disabled={!isLoading}
                    />
                </StyledButtonContainer>
                <Breaker />
            </ModalContent>
            <ModalActions>
                <Button
                    text='Import Wallet'
                    onClick={onPrivateKeyModal}
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

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledMnemonicContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: -5px;
    margin-top: -5px;
`;

const StyledWord = styled.div`
    flex-basis: calc(20% - ${props => props.theme.spacing[2] / 2}px);
    display: flex;
    background: ${props => props.theme.colors.darkenedBg};
    color: ${props => props.theme.colors.blue};
    font-size: ${props => props.theme.sizes.body}px;
    height: 25px;
    border-radius: ${props => props.theme.spacing[1]}px;
    font-weight: 500;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 5px;
    margin-top: 5px;
    align-items: center;
    justify-content: center;
`;

export default MnemonicModal;
