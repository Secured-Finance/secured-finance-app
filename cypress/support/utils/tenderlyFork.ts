import { JsonRpcProvider } from '@ethersproject/providers';
import axios from 'axios';
import { Wallet } from 'ethers';
import request from 'request';
import { CustomizedBridge } from './customBridget';

const TENDERLY_KEY = Cypress.env('TENDERLY_KEY');
const TENDERLY_ACCOUNT = Cypress.env('TENDERLY_ACCOUNT');
const TENDERLY_PROJECT = Cypress.env('TENDERLY_PROJECT');

export const DEFAULT_TEST_ACCOUNT = {
    privateKey:
        '2ab22efc6bc85a9cd2d6281416500d8523ba57206d94cb333cbd09977ca75479',
    address: '0x38F217d0762F28c806BD32cFEC5984385Fed97cB'.toLowerCase(),
};

const tenderly = axios.create({
    baseURL: 'https://api.tenderly.co/api/v1/',
    headers: {
        'X-Access-Key': TENDERLY_KEY,
    },
});

export class TenderlyFork {
    public _forkNetworkID: string;
    public _chainID: number;
    private fork_id: string;
    private delete = true;

    constructor(forkNetworkID: number, forkId?: string) {
        this._forkNetworkID = forkNetworkID.toString();
        this._chainID = 3030;
        if (forkId) {
            this.fork_id = forkId;
            this.delete = false;
        }
    }

    async init() {
        if (this.fork_id) {
            cy.log(`using existing fork: ${this.fork_id}`);
            return;
        }

        cy.log('initializing new fork');
        const response = await tenderly.post(
            `account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/fork`,
            {
                network_id: this._forkNetworkID,
                chain_config: { chain_id: this._chainID },
            }
        );
        this.fork_id = response.data.simulation_fork.id;
    }

    get_rpc_url() {
        if (!this.fork_id) throw new Error('Fork not initialized!');
        return `https://rpc.tenderly.co/fork/${this.fork_id}`;
    }

    async add_balance(address: string, amount: number) {
        if (!this.fork_id) throw new Error('Fork not initialized!');
        tenderly.post(
            `account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/fork/${this.fork_id}/balance`,
            { accounts: [address], amount: amount }
        );
    }

    async add_balance_rpc(address: string) {
        if (!this.fork_id) throw new Error('Fork not initialized!');
        const options = {
            url: this.get_rpc_url(),
            method: 'post',
            headers: { 'content-type': 'text/plain' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tenderly_setBalance',
                params: [address, '0x21e19e0c9bab2400000'],
                id: '1234',
            }),
        };
        request(options);
    }

    async deleteFork() {
        if (!this.delete) {
            return;
        }
        cy.log(`deleting fork ${this.fork_id}`);
        await tenderly.delete(
            `account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/fork/${this.fork_id}`
        );
    }

    onBeforeLoad() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (win: any) => {
            const rpc = this.get_rpc_url();
            const provider = new JsonRpcProvider(rpc, 3030);
            const signer = new Wallet(
                DEFAULT_TEST_ACCOUNT.privateKey,
                provider
            );
            win.ethereum = new CustomizedBridge(signer, provider);
        };
    }
}
