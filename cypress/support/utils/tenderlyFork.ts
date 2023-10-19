import axios from 'axios';
import { CustomizedBridge } from '../../../src/stories/mocks/customBridge';

const TENDERLY_KEY = Cypress.env('TENDERLY_KEY');
const TENDERLY_ACCOUNT = Cypress.env('TENDERLY_ACCOUNT');
const TENDERLY_PROJECT = Cypress.env('TENDERLY_PROJECT');
const TENDERLY_PERSIST_FORK_AFTER_RUN = Cypress.env(
    'TENDERLY_PERSIST_FORK_AFTER_RUN'
);

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
    public forkNetworkID: string;
    public chainId: number;
    private forkId: string;
    private persist = false;

    constructor(forkNetworkID: number, forkId?: string) {
        assert(TENDERLY_KEY, 'TENDERLY_KEY is required');
        assert(TENDERLY_ACCOUNT, 'TENDERLY_ACCOUNT is required');
        assert(TENDERLY_PROJECT, 'TENDERLY_PROJECT is required');

        this.forkNetworkID = forkNetworkID.toString();
        this.chainId = forkNetworkID;
        if (forkId) {
            this.forkId = forkId;
        }
        if (TENDERLY_PERSIST_FORK_AFTER_RUN) {
            this.persist = TENDERLY_PERSIST_FORK_AFTER_RUN;
        }
    }

    async init() {
        if (this.forkId) {
            cy.log(`using existing fork: ${this.forkId}`);
            return;
        }

        cy.log('initializing new fork');
        const response = await tenderly.post(
            `account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/fork`,
            {
                network_id: this.forkNetworkID,
                chain_config: { chain_id: this.chainId },
            }
        );
        this.forkId = response.data.simulation_fork.id;
    }

    getRpcUrl() {
        if (!this.forkId) throw new Error('Fork not initialized!');
        return `https://rpc.tenderly.co/fork/${this.forkId}`;
    }

    async deleteFork() {
        if (this.persist) {
            cy.log(`fork will not be deleted: ${this.forkId}`);
            return;
        }
        cy.log(`deleting fork ${this.forkId}`);
        await tenderly.delete(
            `account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/fork/${this.forkId}`
        );
    }

    onBeforeLoad() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (win: any) => {
            win.localStorage.clear();
            const rpc = this.getRpcUrl();
            const provider = new JsonRpcProvider(rpc, this.chainId);

            win.localStorage.setItem('FORK', 'true');

            win.ethereum = new CustomizedBridge(
                provider.getSigner(),
                provider,
                this.chainId
            );
        };
    }
}
