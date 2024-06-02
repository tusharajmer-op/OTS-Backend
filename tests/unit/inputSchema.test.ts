import { routeToSchema } from '../../src/utilities/joiValidations';
import { test, expect } from '@jest/globals';

describe('Joi Validations', () => {
    describe('Sign Up Form', () => {
        const schema = routeToSchema['/sign-up']();

        test('Validates form correctly', () => {
            const { error } = schema.validate({
                name: 'John Doe',
                email: 'test@test.com',
                password: 'password123'
            });
            expect(error).toBeDefined();

            const { error: error2 } = schema.validate({
                name: '',
                email: 'test@test.com',
                password: 'password123'
            });
            expect(error2).toBeDefined();
        });
    });

    describe('Log In Form', () => {
        const schema = routeToSchema['/log-in']();

        test('Validates form correctly', () => {
            const { error } = schema.validate({
                email: 'test@test.com',
                password: 'Password@123'
            });
            expect(error).toBeDefined();

            const { error: error2 } = schema.validate({
                email: 'test@test.com',
                password: 'password123'
            });
            expect(error2).toBeDefined();

            const { error: error3 } = schema.validate({
                email: 'invalidemail',
                password: 'password123'
            });
            expect(error3).toBeDefined();
        });
    });

    describe('Question Form', () => {
        const schema = routeToSchema['/question/next']();

        test('Validates form correctly', () => {
            const { error } = schema.validate({
                test_id: '123',
                question_id: '456',
                answer: 'option1'
            });
            expect(error).toBeUndefined();

            const { error: error2 } = schema.validate({
                test_id: '',
                question_id: '456',
                answer: 'option1'
            });
            expect(error2).toBeDefined();
        });
    });

    describe('Google Auth Form', () => {
        const schema = routeToSchema['/google-auth']();

        test('Validates form correctly', () => {
            const { error } = schema.validate({ code: '123456' });
            expect(error).toBeUndefined();

            const { error: error2 } = schema.validate({ code: '' });
            expect(error2).toBeDefined();
        });
    });
});
