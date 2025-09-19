// Utility functions to replace sf-graph-client utilities
// Simple implementations for converting between strings and bytes32

import { ethers } from 'ethers';

/**
 * Convert a string to bytes32 format
 * @param str - String to convert
 * @returns bytes32 string
 */
export const toBytes32 = (str: string): string => {
    return ethers.utils.formatBytes32String(str);
};

/**
 * Convert bytes32 to string format
 * @param bytes32 - bytes32 string to convert
 * @returns string
 */
export const fromBytes32 = (bytes32: string): string => {
    return ethers.utils.parseBytes32String(bytes32);
};
