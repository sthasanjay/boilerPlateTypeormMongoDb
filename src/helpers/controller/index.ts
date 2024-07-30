import { plainToInstance } from "class-transformer";
import { ClassType } from "class-transformer-validator";
import { ValidationError, validate } from "class-validator";
import { Request } from "express";

export interface ValidationErrorResponse {
    validationErrors?: ValidationError[];
}

export type ValidationResult<T> =
    | {
          validatedData: T;
          errors: undefined;
      }
    | {
          validatedData: undefined;
          errors: ValidationErrorResponse;
      };

/**
 * Convert object to the given type.
 * @template T
 * @param request
 * @param convertToType
 * @returns {T} Converted object of the given type if valid
 */
async function validateBodyInput<T>(
    request: Request,
    convertToType: ClassType<T>,
): Promise<ValidationResult<T>> {
    const convertedBody = convertBody(request, convertToType);
    return _validate(convertedBody);
}

/**
 * Validate object and return the result.
 *
 * @template T
 * @param {T} obj
 * @returns {Promise<ValidationResult<T>>}: Promise of ValidationResult object with validatedData or errors property set.
 */
async function _validate<T>(obj: T): Promise<ValidationResult<T>> {
    const validationErrors = await validate(obj as unknown as object, {
        whitelist: true,
    });
    if (validationErrors.length === 0) {
        return { validatedData: obj, errors: undefined };
    }
    const response: ValidationErrorResponse = { validationErrors };
    return { errors: response, validatedData: undefined };
}

/**
 * Convert body to the given type.
 * @template T
 * @param {Request} request
 * @param {ClassType<T>} toType
 * @returns {T} Converted object

 */
function convertBody<T>(request: Request, toType: ClassType<T>): T {
    return convert(request.body, toType);
}

/**
 * Convert object to the given type.
 * @template T
 * @param {any} object
 * @param {ClassType<T>} toType
 * @returns {T} Converted object
 */
function convert<T>(object: any, toType: ClassType<T>): T {
    return plainToInstance(toType, object, { exposeUnsetFields: true });
}

export { validateBodyInput };
