import {
    identify,
    Identify,
    setUserId,
    track,
} from '@amplitude/analytics-browser';
import { InterfaceEvents, InterfaceProperties } from './interface';

export async function associateWallet(account: string | null) {
    if (!account) return;
    setUserId(account);
    const user = new Identify();
    user.set('wallet_address', account);
    identify(user);

    track(InterfaceEvents.WALLET_CONNECTED, {
        [InterfaceProperties.WALLET_ADDRESS]: account,
    });
}
