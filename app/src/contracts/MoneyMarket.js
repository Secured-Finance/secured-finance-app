export const MoneyMarket_address = '0x87630E3A1743d09963b9Df943651C6d6fbccbe6E';

export const MoneyMarket_ABI = [
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
    name: 'DelMoneyMarketBook',
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
    name: 'SetMoneyMarketBook',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'enum MoneyMarket.Ccy',
        name: 'ccy',
        type: 'uint8',
      },
      {
        components: [
          {
            internalType: 'enum MoneyMarket.Term',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'amt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
        ],
        internalType: 'struct MoneyMarket.MoneyMarketInput[]',
        name: 'lenders',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'enum MoneyMarket.Term',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'amt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
        ],
        internalType: 'struct MoneyMarket.MoneyMarketInput[]',
        name: 'borrowers',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'effectiveSec',
        type: 'uint256',
      },
    ],
    name: 'setMoneyMarketBook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'delMoneyMarketBook',
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
        internalType: 'enum MoneyMarket.Side',
        name: 'side',
        type: 'uint8',
      },
      {
        internalType: 'enum MoneyMarket.Ccy',
        name: 'ccy',
        type: 'uint8',
      },
      {
        internalType: 'enum MoneyMarket.Term',
        name: 'term',
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
        internalType: 'enum MoneyMarket.Side',
        name: 'side',
        type: 'uint8',
      },
      {
        internalType: 'enum MoneyMarket.Ccy',
        name: 'ccy',
        type: 'uint8',
      },
      {
        internalType: 'enum MoneyMarket.Term',
        name: 'term',
        type: 'uint8',
      },
    ],
    name: 'getOneItem',
    outputs: [
      {
        components: [
          {
            internalType: 'enum MoneyMarket.Term',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'amt',
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
        internalType: 'struct MoneyMarket.MoneyMarketItem',
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
                internalType: 'enum MoneyMarket.Term',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amt',
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
            internalType: 'struct MoneyMarket.MoneyMarketItem[6][2]',
            name: 'lenders',
            type: 'tuple[6][2]',
          },
          {
            components: [
              {
                internalType: 'enum MoneyMarket.Term',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amt',
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
            internalType: 'struct MoneyMarket.MoneyMarketItem[6][2]',
            name: 'borrowers',
            type: 'tuple[6][2]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct MoneyMarket.MoneyMarketBook',
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
                internalType: 'enum MoneyMarket.Term',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amt',
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
            internalType: 'struct MoneyMarket.MoneyMarketItem[6][2]',
            name: 'lenders',
            type: 'tuple[6][2]',
          },
          {
            components: [
              {
                internalType: 'enum MoneyMarket.Term',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amt',
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
            internalType: 'struct MoneyMarket.MoneyMarketItem[6][2]',
            name: 'borrowers',
            type: 'tuple[6][2]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct MoneyMarket.MoneyMarketBook[]',
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
                internalType: 'enum MoneyMarket.Term',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amt',
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
            internalType: 'struct MoneyMarket.MoneyMarketItem[6][2]',
            name: 'lenders',
            type: 'tuple[6][2]',
          },
          {
            components: [
              {
                internalType: 'enum MoneyMarket.Term',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'amt',
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
            internalType: 'struct MoneyMarket.MoneyMarketItem[6][2]',
            name: 'borrowers',
            type: 'tuple[6][2]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct MoneyMarket.MoneyMarketBook',
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
    name: 'getLenderRates',
    outputs: [
      {
        internalType: 'uint256[6][2]',
        name: '',
        type: 'uint256[6][2]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getBorrowerRates',
    outputs: [
      {
        internalType: 'uint256[6][2]',
        name: '',
        type: 'uint256[6][2]',
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
        internalType: 'uint256[6][2]',
        name: '',
        type: 'uint256[6][2]',
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
