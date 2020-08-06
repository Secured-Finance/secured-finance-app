export const Fx_address = process.env.REACT_APP_FX_ADDRESS

export const Fx_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amtBuy',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amtSell',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fxRate',
        type: 'uint256',
      },
    ],
    name: 'DEBUG',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'DelFXBook',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'DelOneItem',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'SetFXBook',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'enum FXMarket.CcyPair',
        name: 'pair',
        type: 'uint8',
      },
      {
        components: [
          {
            internalType: 'enum FXMarket.Ccy',
            name: 'ccyBuy',
            type: 'uint8',
          },
          {
            internalType: 'enum FXMarket.Ccy',
            name: 'ccySell',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'amtBuy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amtSell',
            type: 'uint256',
          },
        ],
        internalType: 'struct FXMarket.FXInput',
        name: 'offerInput',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum FXMarket.Ccy',
            name: 'ccyBuy',
            type: 'uint8',
          },
          {
            internalType: 'enum FXMarket.Ccy',
            name: 'ccySell',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'amtBuy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amtSell',
            type: 'uint256',
          },
        ],
        internalType: 'struct FXMarket.FXInput',
        name: 'bidInput',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'effectiveSec',
        type: 'uint256',
      },
    ],
    name: 'setFXBook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'delFXBook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        internalType: 'enum FXMarket.Side',
        name: 'side',
        type: 'uint8',
      },
      {
        internalType: 'enum FXMarket.CcyPair',
        name: 'pair',
        type: 'uint8',
      },
    ],
    name: 'delOneItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        internalType: 'enum FXMarket.Side',
        name: 'side',
        type: 'uint8',
      },
      {
        internalType: 'enum FXMarket.CcyPair',
        name: 'pair',
        type: 'uint8',
      },
    ],
    name: 'getOneItem',
    outputs: [
      {
        components: [
          {
            internalType: 'enum FXMarket.CcyPair',
            name: 'pair',
            type: 'uint8',
          },
          {
            internalType: 'enum FXMarket.Ccy',
            name: 'ccyBuy',
            type: 'uint8',
          },
          {
            internalType: 'enum FXMarket.Ccy',
            name: 'ccySell',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'amtBuy',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amtSell',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'goodtil',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isAvailable',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        internalType: 'struct FXMarket.FXItem',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'getOneBook',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'enum FXMarket.CcyPair',
                name: 'pair',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccyBuy',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccySell',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amtBuy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amtSell',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'rate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'goodtil',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'address',
                name: 'addr',
                type: 'address',
              },
            ],
            internalType: 'struct FXMarket.FXItem[1]',
            name: 'bids',
            type: 'tuple[1]',
          },
          {
            components: [
              {
                internalType: 'enum FXMarket.CcyPair',
                name: 'pair',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccyBuy',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccySell',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amtBuy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amtSell',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'rate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'goodtil',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'address',
                name: 'addr',
                type: 'address',
              },
            ],
            internalType: 'struct FXMarket.FXItem[1]',
            name: 'offers',
            type: 'tuple[1]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct FXMarket.FXBook',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getAllBooks',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'enum FXMarket.CcyPair',
                name: 'pair',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccyBuy',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccySell',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amtBuy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amtSell',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'rate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'goodtil',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'address',
                name: 'addr',
                type: 'address',
              },
            ],
            internalType: 'struct FXMarket.FXItem[1]',
            name: 'bids',
            type: 'tuple[1]',
          },
          {
            components: [
              {
                internalType: 'enum FXMarket.CcyPair',
                name: 'pair',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccyBuy',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccySell',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amtBuy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amtSell',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'rate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'goodtil',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'address',
                name: 'addr',
                type: 'address',
              },
            ],
            internalType: 'struct FXMarket.FXItem[1]',
            name: 'offers',
            type: 'tuple[1]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct FXMarket.FXBook[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getBestBook',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'enum FXMarket.CcyPair',
                name: 'pair',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccyBuy',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccySell',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amtBuy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amtSell',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'rate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'goodtil',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'address',
                name: 'addr',
                type: 'address',
              },
            ],
            internalType: 'struct FXMarket.FXItem[1]',
            name: 'bids',
            type: 'tuple[1]',
          },
          {
            components: [
              {
                internalType: 'enum FXMarket.CcyPair',
                name: 'pair',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccyBuy',
                type: 'uint8',
              },
              {
                internalType: 'enum FXMarket.Ccy',
                name: 'ccySell',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amtBuy',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'amtSell',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'rate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'goodtil',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'address',
                name: 'addr',
                type: 'address',
              },
            ],
            internalType: 'struct FXMarket.FXItem[1]',
            name: 'offers',
            type: 'tuple[1]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct FXMarket.FXBook',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getOfferRates',
    outputs: [
      {
        internalType: 'uint256[1]',
        name: '',
        type: 'uint256[1]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getBidRates',
    outputs: [
      {
        internalType: 'uint256[1]',
        name: '',
        type: 'uint256[1]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getMidRates',
    outputs: [
      {
        internalType: 'uint256[1]',
        name: '',
        type: 'uint256[1]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getMarketMakers',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
];
