import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from './constants';
import createPath from './createPath';
import connectLedger from './connectLedger';
import {
    calculateUSDBalance,
    recalculateTotalUSDBalance,
} from '../../store/wallets/helpers';
import { Network } from '@glif/filecoin-address';

const fetchDefaultWallet = async (
    dispatch: any,
    network: Network = Network.TEST
) => {
    const provider = await connectLedger(dispatch);
    if (!provider) return null;

    // @ts-ignore
    const [defaultAddress] = await provider.wallet.getAccounts(0, 1, network);
    const balance = await provider.getBalance(defaultAddress);
    const networkCode =
        // @ts-ignore
        network === Network.MAIN ? MAINNET_PATH_CODE : TESTNET_PATH_CODE;

    let path = createPath(networkCode, 0);
    const usdBalance = dispatch(calculateUSDBalance('filecoin', balance));
    dispatch(recalculateTotalUSDBalance(usdBalance));

    return {
        balance,
        address: defaultAddress,
        path,
    };
};

export default fetchDefaultWallet;
