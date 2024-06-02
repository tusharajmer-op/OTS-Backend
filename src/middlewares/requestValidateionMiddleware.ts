import { Request, Response, NextFunction } from 'express';
import { routeToSchema } from '../utilities/joiValidations';
import ErrorHandler from './errorhandler';
import { createErrorResponse } from '../utilities/createResponse';
import { LOG_PRIORITY } from '../utilities/constants';

/**
 * Middleware function to validate incoming requests
 */
const validateIncomingRequest = () => {
    // Space which could be used for later logic

    const _allowedMethod = ['POST', 'PUT'];
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const _route = req.route.path;
            const _method = req.method;

            if (_allowedMethod.includes(_method)) {
                const _schema = routeToSchema[_route];
                if (!_schema) {
                    // If no schema found for the route, create an error response and pass it to the error handler
                    const cerror = createErrorResponse(false, 'Something went wrong', [], 'alert', 500, LOG_PRIORITY[3]);
                    const er = ErrorHandler.customError(cerror);
                    next(er);
                }

                const { error } = _schema().validate(req.body);

                if (error) {
                    // If request validation fails, create an error response and pass it to the error handler
                    let message = '';
                    message += error.details.map((item: Record<string, any>) => `${item.message}`);
                    console.log(message);
                    const cerror = createErrorResponse(false, 'Invalid Request', [], message, 400, LOG_PRIORITY[5]);
                    const er = ErrorHandler.customError(cerror);
                    next(er);
                }
            }
            next();
        } catch (e) {
            console.log(e);
        }
    };
};

export default validateIncomingRequest;
