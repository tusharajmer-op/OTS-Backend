import { createResponse } from "../../src/utilities/createResponse";
import { expect, test } from '@jest/globals';

describe('Testing createResponse', () => {
    test('Should create a successful response object', () => {
        const status = true;
        const message = 'Success';
        const data = { id: 1, name: 'John' };
        const code = 200;

        const response = createResponse(status, message, data, code);

        expect(response).toEqual({
            status: true,
            message: 'Success',
            data: { id: 1, name: 'John' },
            code: 200
        });
    });
});