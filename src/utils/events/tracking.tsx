import { identify, Identify, setUserId } from '@amplitude/analytics-browser';

export async function associateWallet(account: string | null) {
    if (!account) return;
    setUserId(account);
    const user = new Identify();
    user.set('wallet_address', account);
    identify(user);
}
