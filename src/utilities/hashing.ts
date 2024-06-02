import bcrypt from 'bcrypt';

/**
 * Encrypts the given data using bcrypt hashing algorithm.
 * @param data - The data to be encrypted.
 * @returns A Promise that resolves to the encrypted hash.
 */
const encryptData = async (data: string): Promise<string> => {
    // Generate a hash using bcrypt with the specified number of salt rounds.
    const hash = await bcrypt.hash(data, Number(process.env.SALT_ROUNDS) || 10);
    return hash;
};

/**
 * Compares the given data with the provided hash using bcrypt.
 * @param data - The data to be compared.
 * @param hash - The hash to compare against.
 * @returns A Promise that resolves to a boolean indicating whether the data matches the hash.
 */
const compareData = async (data: string, hash: string): Promise<boolean> => {
    // Compare the data with the hash using bcrypt.
    const match = await bcrypt.compare(data, hash);
    return match;
};

export {
    encryptData,
    compareData
};