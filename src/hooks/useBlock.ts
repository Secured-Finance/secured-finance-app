import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import Web3 from 'web3';
// import debounce from 'debounce'

const useBlock = (): number => {
    const [block, setBlock] = useState(0);
    const { ethereum } = useWallet();

    useEffect(() => {
        // const setBlockDebounced = debounce(setBlock, 300)
        if (!ethereum) return;
        const web3 = new Web3(ethereum as any);

        // const subscription = new Web3(ethereum).eth.subscribe(
        //   'newBlockHeaders',
        //   (error, result) => {
        //     if (!error) {
        //       setBlockDebounced(result.number)
        //     }
        //   },
        // )

        const interval = setInterval(async () => {
            const latestBlockNumber = await web3.eth.getBlockNumber();
            if (block !== latestBlockNumber) {
                setBlock(latestBlockNumber);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [ethereum]);

    return block;
};

export default useBlock;
