import { SavedMarket } from 'src/types';

const SAVED_MARKETS_KEY = 'SAVED_MARKETS_KEY';

export function writeMarketInStore(_market: SavedMarket) {
    const savedMarkets = JSON.parse(
        localStorage.getItem(SAVED_MARKETS_KEY) || '[]'
    );
    savedMarkets.push(_market);
    localStorage.setItem(SAVED_MARKETS_KEY, JSON.stringify(savedMarkets));
}

export function readMarketsFromStore(): SavedMarket[] {
    const savedMarkets = localStorage.getItem(SAVED_MARKETS_KEY);
    return savedMarkets ? JSON.parse(savedMarkets) : [];
}

export function removeMarketFromStore(_market: SavedMarket) {
    const savedMarkets = JSON.parse(
        localStorage.getItem(SAVED_MARKETS_KEY) || '[]'
    );
    const updatedMarkets = savedMarkets.filter(
        (savedMarket: SavedMarket) =>
            savedMarket.market !== _market.market ||
            savedMarket.address !== _market.address
    );
    localStorage.setItem(SAVED_MARKETS_KEY, JSON.stringify(updatedMarkets));
}

export function isMarketInStore(_market: SavedMarket): boolean {
    const savedMarkets = JSON.parse(
        localStorage.getItem(SAVED_MARKETS_KEY) || '[]'
    );
    return savedMarkets.some(
        (savedMarket: SavedMarket) =>
            savedMarket.market === _market.market &&
            savedMarket.address === _market.address
    );
}
