import * as z from 'zod/v4';
export { z };
import { ValidationError } from './errors.mjs';

const validateZodSchema = (schema)=>(data, errorMessage)=>{
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const { message, errors } = formatZodErrors(error);
                throw new ValidationError(errorMessage || message, {
                    errors
                });
            }
            throw error;
        }
    };
const formatZodErrors = (zodError)=>({
        errors: zodError.issues.map((issue)=>{
            return {
                path: issue.path.map(String),
                message: issue.message,
                name: 'ValidationError',
                value: undefined
            };
        }),
        message: zodError.issues[0]?.message ?? 'Validation error'
    });
/**
 * Converts a ZodError into form-compatible errors matching
 * getYupValidationErrors from @strapi/admin Form component.
 *
 * Returns a flat object with dot-path keys and string error messages.
 * Only the first error per path is kept (matches Yup behavior).
 * Root-level errors (path = []) are stored under the empty string key ''.
 */ const getZodValidationErrors = (error)=>{
    const errors = {};
    for (const issue of error.issues){
        const path = issue.path.join('.');
        if (!(path in errors)) {
            errors[path] = issue.message;
        }
    }
    return errors;
};

export { getZodValidationErrors, validateZodSchema };
//# sourceMappingURL=zod.mjs.map
