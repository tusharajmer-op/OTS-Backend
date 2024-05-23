import bcrypt from 'bcrypt';

const encryptDate = async(data : string) : Promise<string> =>{
    
    const hash = await bcrypt.hash(data,Number(process.env.SALT_ROUNDS)||10);
    return hash;
};
const compareData = async(data:string,hash:string) : Promise<boolean> =>{
    const match = await bcrypt.compare(data,hash);
    return match;
};

export {
    encryptDate,
    compareData
};