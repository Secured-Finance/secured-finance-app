import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
	ONE_MINUTE_IN_SECONDS,
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	ONE_YEAR_IN_SECONDS,
	ZERO: new BigNumber(0),
	ONE: new BigNumber(1),
	ONES_31: new BigNumber('4294967295'), // 2**32-1
	ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
	ONES_255: new BigNumber(
		'115792089237316195423570985008687907853269984665640564039457584007913129639935',
	), // 2**256-1
	INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const contractsAddresses = {
	lendingController: '0x0d1a99841ae744556D6397826F2d158993287947',
	fxMarket: '0x6D1e0d1DE236e8dBDa99Ccd549B8421A1A87B72F',
	collateral: '0x86D971F85Be1f6e3C1b1E41d74104560e9e2040d',
	loan: '0x51C947C8dFc96E591DE1Cb4007150fAd46907b05',
	// usdc: '',
}

export const lendingMarkets = [
	{
		ccy: "FIL",
		ccyIndex: 1,
		markets: [
			{
				term: '3 month',
				termIndex: 0,
				address: "0xe497CFF94Bf62CDA3BA49DCe66D7Fd767800e865",	
			},
			{
				term: '6 month',
				termIndex: 1,
				address: "0x255679287C0EDBc7a39bF4EEAA95f8389553676c",	
			},
			{
				term: '1 year',
				termIndex: 2,
				address: "0x377e216ef37d3BD72774C27726f3F0BDE8c22D22",	
			},
			{
				term: '2 year',
				termIndex: 3,
				address: "0x6A735e6930da93DF3BA2E4be1C75b2df996E45EF",	
			},
			{
				term: '3 year',
				termIndex: 4,
				address: "0x599E4122D166302391Fa70F2ad64E04f1DFA840d",	
			},
			{
				term: '5 year',
				termIndex: 5,
				address: "0x1a21094368DA603A57D43ccc9609A97eda9f455A",	
			},
		]
	},
]
