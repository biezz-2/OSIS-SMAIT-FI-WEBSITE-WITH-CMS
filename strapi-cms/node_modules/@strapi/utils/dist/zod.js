'use strict';

var z = require('zod/v4');
var errors = require('./errors.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var z__namespace = /*#__PURE__*/_interopNamespace(z);

const validateZodSchema = (schema)=>(data, errorMessage)=>{
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof z__namespace.ZodError) {
                const { message, errors: errors$1 } = formatZodErrors(error);
                throw new errors.ValidationError(errorMessage || message, {
                    errors: errors$1
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

exports.z = z__namespace;
exports.getZodValidationErrors = getZodValidationErrors;
exports.validateZodSchema = validateZodSchema;
//# sourceMappingURL=zod.js.map
