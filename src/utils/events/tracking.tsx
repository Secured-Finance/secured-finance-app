import {
    identify,
    Identify,
    setUserId,
    track,
} from '@amplitude/analytics-browser';
import { AmountConverter, CurrencySymbol } from '../';
import {
    ButtonEvents,
    ButtonProperties,
    CollateralEvents,
    CollateralProperties,
    InterfaceEvents,
    InterfaceProperties,
    ZCTokenEvents,
    ZCTokenProperties,
} from './interface';

export async function associateWallet(
    account: string | null,
    chainName: string | undefined,
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
            [InterfaceProperties.CHAIN]: chainName ?? 'Unsupported',
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
        [CollateralProperties.AMOUNT]: AmountConverter.fromBase(
            amount,
            assetType
        ).toString(),
        [CollateralProperties.SOURCE]: source,
    });
}

export function trackZCTokenEvent(
    event: ZCTokenEvents,
    assetType: CurrencySymbol,
    maturity: number,
    amount: bigint,
    source: string
) {
    track(event, {
        [ZCTokenProperties.ASSET_TYPE]: assetType,
        [ZCTokenProperties.MATURITY]: maturity,
        [ZCTokenProperties.AMOUNT]: AmountConverter.fromBase(
            amount,
            assetType
        ).toString(),
        [ZCTokenProperties.SOURCE]: source,
    });
}

export function trackButtonEvent(
    event: ButtonEvents,
    property: ButtonProperties,
    value: string
) {
    track(event, { [property]: value });
}
