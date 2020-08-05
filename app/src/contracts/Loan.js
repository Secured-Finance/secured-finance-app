export const Loan_address = '0xDA5253f6382D3c4f85E169f170C2a1F09dD84874';

export const Loan_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'moneyAddr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'fxAddr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'colAddr',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
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
    name: 'SetLoanBook',
    type: 'event',
  },
  {
    inputs: [],
    name: 'getAllUsers',
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
  {
    inputs: [
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
    name: 'getSchedule',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'notices',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'payments',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'amounts',
            type: 'uint256[5]',
          },
        ],
        internalType: 'struct Loan.Schedule',
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
        name: 'makerAddr',
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
      {
        internalType: 'uint256',
        name: 'amt',
        type: 'uint256',
      },
    ],
    name: 'makeLoanDeal',
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
    ],
    name: 'getOneBook',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'borrower',
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
                components: [
                  {
                    internalType: 'uint256',
                    name: 'start',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'end',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256[5]',
                    name: 'notices',
                    type: 'uint256[5]',
                  },
                  {
                    internalType: 'uint256[5]',
                    name: 'payments',
                    type: 'uint256[5]',
                  },
                  {
                    internalType: 'uint256[5]',
                    name: 'amounts',
                    type: 'uint256[5]',
                  },
                ],
                internalType: 'struct Loan.Schedule',
                name: 'schedule',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'pv',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'asOf',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'enum Loan.State',
                name: 'state',
                type: 'uint8',
              },
            ],
            internalType: 'struct Loan.LoanItem[]',
            name: 'loans',
            type: 'tuple[]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct Loan.LoanBook',
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
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'borrower',
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
                components: [
                  {
                    internalType: 'uint256',
                    name: 'start',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'end',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256[5]',
                    name: 'notices',
                    type: 'uint256[5]',
                  },
                  {
                    internalType: 'uint256[5]',
                    name: 'payments',
                    type: 'uint256[5]',
                  },
                  {
                    internalType: 'uint256[5]',
                    name: 'amounts',
                    type: 'uint256[5]',
                  },
                ],
                internalType: 'struct Loan.Schedule',
                name: 'schedule',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'pv',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'asOf',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isAvailable',
                type: 'bool',
              },
              {
                internalType: 'enum Loan.State',
                name: 'state',
                type: 'uint8',
              },
            ],
            internalType: 'struct Loan.LoanItem[]',
            name: 'loans',
            type: 'tuple[]',
          },
          {
            internalType: 'bool',
            name: 'isValue',
            type: 'bool',
          },
        ],
        internalType: 'struct Loan.LoanBook[]',
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
    name: 'updateAllPV',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
