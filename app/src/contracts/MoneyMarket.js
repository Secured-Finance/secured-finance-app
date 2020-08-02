export const MoneyMarket_address='0xC2B09Bfdac5deC15a15E37c9E0E010bc6fE0e9BD'

export const MoneyMarket_ABI=[
	{
		"inputs": [
			{
				"internalType": "enum MoneyMarket.Ccy",
				"name": "ccy",
				"type": "uint8"
			},
			{
				"components": [
					{
						"internalType": "enum MoneyMarket.Term",
						"name": "term",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "size",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rate",
						"type": "uint256"
					}
				],
				"internalType": "struct MoneyMarket.LoanInput[]",
				"name": "lenders",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "enum MoneyMarket.Term",
						"name": "term",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "size",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rate",
						"type": "uint256"
					}
				],
				"internalType": "struct MoneyMarket.LoanInput[]",
				"name": "borrowers",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256",
				"name": "effectiveSec",
				"type": "uint256"
			}
		],
		"name": "setLoans",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllBooks",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "enum MoneyMarket.Term",
								"name": "term",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "size",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "rate",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "goodtil",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isAvailable",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "addr",
								"type": "address"
							}
						],
						"internalType": "struct MoneyMarket.LoanItem[6][2]",
						"name": "lenders",
						"type": "tuple[6][2]"
					},
					{
						"components": [
							{
								"internalType": "enum MoneyMarket.Term",
								"name": "term",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "size",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "rate",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "goodtil",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isAvailable",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "addr",
								"type": "address"
							}
						],
						"internalType": "struct MoneyMarket.LoanItem[6][2]",
						"name": "borrowers",
						"type": "tuple[6][2]"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					}
				],
				"internalType": "struct MoneyMarket.LoanBook[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBestBook",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "enum MoneyMarket.Term",
								"name": "term",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "size",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "rate",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "goodtil",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isAvailable",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "addr",
								"type": "address"
							}
						],
						"internalType": "struct MoneyMarket.LoanItem[6][2]",
						"name": "lenders",
						"type": "tuple[6][2]"
					},
					{
						"components": [
							{
								"internalType": "enum MoneyMarket.Term",
								"name": "term",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "size",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "rate",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "goodtil",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isAvailable",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "addr",
								"type": "address"
							}
						],
						"internalType": "struct MoneyMarket.LoanItem[6][2]",
						"name": "borrowers",
						"type": "tuple[6][2]"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					}
				],
				"internalType": "struct MoneyMarket.LoanBook",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBorrowerRates",
		"outputs": [
			{
				"internalType": "uint256[6][2]",
				"name": "",
				"type": "uint256[6][2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLenderRates",
		"outputs": [
			{
				"internalType": "uint256[6][2]",
				"name": "",
				"type": "uint256[6][2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMarketMakers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMidRates",
		"outputs": [
			{
				"internalType": "uint256[6][2]",
				"name": "",
				"type": "uint256[6][2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getOneBook",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "enum MoneyMarket.Term",
								"name": "term",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "size",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "rate",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "goodtil",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isAvailable",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "addr",
								"type": "address"
							}
						],
						"internalType": "struct MoneyMarket.LoanItem[6][2]",
						"name": "lenders",
						"type": "tuple[6][2]"
					},
					{
						"components": [
							{
								"internalType": "enum MoneyMarket.Term",
								"name": "term",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "size",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "rate",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "goodtil",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isAvailable",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "addr",
								"type": "address"
							}
						],
						"internalType": "struct MoneyMarket.LoanItem[6][2]",
						"name": "borrowers",
						"type": "tuple[6][2]"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					}
				],
				"internalType": "struct MoneyMarket.LoanBook",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]