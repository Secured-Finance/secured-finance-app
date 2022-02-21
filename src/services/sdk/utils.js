import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
});

// Contract addresses
export const getLendingControllerAddress = securedFinance => {
    return securedFinance && securedFinance.lendingController;
};
export const getLoanAddress = securedFinance => {
    return securedFinance && securedFinance.loan;
};

export const getCollateralAddress = securedFinance => {
    return securedFinance && securedFinance.collateral;
};
export const getUsdcAddress = securedFinance => {
    return securedFinance && securedFinance.usdc;
};
export const getLendingMarketAddress = (
    securedFinance,
    ccyIndex,
    termIndex
) => {
    let marketAddr;
    securedFinance
        ? securedFinance.contracts.lendingMarkets.map(({ ccy, markets }) => {
              if (ccy == ccyIndex) {
                  markets.map(market => {
                      if (market.term == termIndex) {
                          marketAddr = market.lendingMarketAddress;
                      }
                  });
              }
          })
        : (marketAddr = '');

    return securedFinance && marketAddr;
};

// Contract objects
export const getLendingControllerContract = securedFinance => {
    return (
        securedFinance &&
        securedFinance.contracts &&
        securedFinance.contracts.lendingController
    );
};
export const getLendingMarketContract = (
    securedFinance,
    ccyIndex,
    termIndex
) => {
    let marketContract;
    securedFinance
        ? securedFinance.contracts.lendingMarkets.map(({ ccy, markets }) => {
              if (ccy == ccyIndex) {
                  markets.map(market => {
                      if (market.term == termIndex) {
                          marketContract = market.lendingMarket;
                      }
                  });
              }
          })
        : (marketContract = null);

    return securedFinance && marketContract;
};
export const getLoanContract = securedFinance => {
    return (
        securedFinance &&
        securedFinance.contracts &&
        securedFinance.contracts.loan
    );
};

export const getCollateralContract = securedFinance => {
    return (
        securedFinance &&
        securedFinance.contracts &&
        securedFinance.contracts.collateral
    );
};
export const getUsdcContract = securedFinance => {
    return (
        securedFinance &&
        securedFinance.contracts &&
        securedFinance.contracts.usdc
    );
};

// Approve USDC spending from user account to money market
export const approve = async (usdcContract, LendingMarket, account) => {
    return usdcContract.methods
        .approve(LendingMarket.options.address, ethers.constants.MaxUint256)
        .send({ from: account });
};

export const getUsdcBalance = async (usdcContract, account) => {
    return new BigNumber(await usdcContract.methods.balanceOf(account).call());
};

export const getLenderRates = async (lendingController, ccy) => {
    return lendingController.methods.getLendRatesForCcy(ccy).call();
};

export const getBorrowerRates = async (lendingController, ccy) => {
    return lendingController.methods.getBorrowRatesForCcy(ccy).call();
};

export const getMidRates = async (lendingController, ccy) => {
    return lendingController.methods.getMidRatesForCcy(ccy).call();
};

export const getDiscountFactors = async (lendingController, ccy) => {
    return lendingController.methods.getDiscountFactorsForCcy(ccy).call();
};

export const getLoanInfo = async (loanContract, id) => {
    return loanContract.methods.getLoanItem(id).call();
};

export const checkCollateralBook = async (collateralContract, account) => {
    let book = await collateralContract.methods.getOneBook(account).call();
    if (book.id === '') {
        return false;
    } else {
        return true;
    }
};

export const getCollateralBook = async (collateralContract, account) => {
    return collateralContract.methods.getOneBook(account).call();
};

export const upSizeEth = async (collateralContract, account, amount) => {
    return collateralContract.methods
        .upSizeETH()
        .send({
            from: account,
            value: new BigNumber(amount)
                .times(new BigNumber(10).pow(18))
                .toString(),
        })
        .on('transactionHash', tx => {
            console.log(tx);
            return tx.transactionHash;
        });
};

export const setUpCollateral = async (
    collateralContract,
    id,
    filAddr,
    account,
    amount
) => {
    console.log(collateralContract.methods);
    return collateralContract.methods
        .setColBook(id, filAddr, account)
        .send({
            from: account,
            value: new BigNumber(amount)
                .times(new BigNumber(10).pow(18))
                .toString(),
        })
        .on('transactionHash', tx => {
            console.log(tx);
            return tx.transactionHash;
        });
};

export const placeOrder = async (
    lendingMarketContract,
    account,
    side,
    amount,
    rate,
    deadline
) => {
    return lendingMarketContract.methods
        .order(side, amount, rate, deadline)
        .send({ from: account })
        .on('transactionHash', tx => {
            console.log(tx);
            return tx.transactionHash;
        });
};

export const cancelOrder = async (lendingMarketContract, account, orderId) => {
    return lendingMarketContract.methods
        .cancelOrder(orderId)
        .send({ from: account })
        .on('transactionHash', tx => {
            console.log(tx);
            return tx.transactionHash;
        });
};
