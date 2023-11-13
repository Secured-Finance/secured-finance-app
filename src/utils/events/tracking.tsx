import {
    identify,
    Identify,
    setUserId,
    track,
} from '@amplitude/analytics-browser';
import { amountFormatterFromBase, CurrencySymbol } from '../currencyList';
import {
    CollateralEvents,
    CollateralProperties,
    InterfaceEvents,
    InterfaceProperties,
} from './interface';

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

export function trackCollateralEvent(
    event: CollateralEvents,
    assetType: CurrencySymbol,
    amount: bigint,
    source: string
) {
    track(event, {
        [CollateralProperties.ASSET_TYPE]: assetType,
        [CollateralProperties.AMOUNT]:
            amountFormatterFromBase[assetType](amount).toString(),
        [CollateralProperties.SOURCE]: source,
    });
}
