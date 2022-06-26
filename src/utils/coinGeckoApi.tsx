import axios from 'axios';

export const coingeckoApi = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
});
