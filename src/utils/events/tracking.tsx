import {
    identify,
    Identify,
    setUserId,
    track,
} from '@amplitude/analytics-browser';
import { InterfaceEvents, InterfaceProperties } from './interface';

export async function associateWallet(
    account: string | null,
    raiseEvent = true
) {
    if (!account) return;
    setUserId(account);
    const user = new Identify();
    user.set('wallet_address', account);
    identify(user);

    if (raiseEvent) {
        track(InterfaceEvents.WALLET_CONNECTED, {
            [InterfaceProperties.WALLET_ADDRESS]: account,
        });
    }
}
