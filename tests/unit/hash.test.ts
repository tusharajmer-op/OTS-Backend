import { encryptData, compareData } from '../../src/utilities/hashing';
import { expect, test } from '@jest/globals';

describe('Hashing Utilities', () => {
    test('encryptData should encrypt the data', async () => {
        const data = 'test data';
        const encryptedData = await encryptData(data);

        expect(encryptedData).not.toBe(data);
        expect(typeof encryptedData).toBe('string');
    });

    test('compareData should correctly compare data and hashes', async () => {
        const data = 'test data';
        const differentData = 'different data';
        const encryptedData = await encryptData(data);

        const isMatch = await compareData(data, encryptedData);
        const isNotMatch = await compareData(differentData, encryptedData);

        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });
});