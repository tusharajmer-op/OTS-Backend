import Logger from "../../src/services/loggerService";
import {expect, test} from '@jest/globals';

describe('Testing Logger',()=>{
    beforeAll(()=>{
        console.log('Initializing Loger');
        Logger.configure();
    });
    test('Testing emerge',()=>{
        expect(()=>Logger.emerge('Testing emerge')).not.toThrow();
    });
    test('Testing alert',()=>{
        expect(()=>Logger.alert('Testing alert')).not.toThrow();
    });
    test('Testing crit',()=>{
        expect(()=>Logger.crit('Testing crit')).not.toThrow();
    });
    test('Testing error',()=>{
        expect(()=>Logger.error('Testing error')).not.toThrow();
    });
    test('Testing warning',()=>{
        expect(()=>Logger.warning('Testing warning')).not.toThrow();
    });
    test('Testing notice',()=>{
        expect(()=>Logger.notice('Testing notice')).not.toThrow();
    });
    test('Testing info',()=>{
        expect(()=>Logger.info('Testing info')).not.toThrow();
    });
    test('Testing debuf',()=>{
        expect(()=>Logger.debug('Testing debug')).not.toThrow();
    });
    
});