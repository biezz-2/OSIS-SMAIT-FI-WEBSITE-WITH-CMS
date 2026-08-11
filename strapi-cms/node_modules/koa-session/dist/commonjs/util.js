"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crc_1 = __importDefault(require("crc"));
exports.default = {
    /**
     * Decode the base64 cookie value to an object
     * @private
     */
    decode(base64String) {
        const body = Buffer.from(base64String, 'base64').toString('utf8');
        const json = JSON.parse(body);
        return json;
    },
    /**
     * Encode an object into a base64-encoded JSON string
     */
    encode(data) {
        return Buffer.from(JSON.stringify(data)).toString('base64');
    },
    hash(data) {
        return crc_1.default.crc32(JSON.stringify(data));
    },
    CookieDateEpoch: 'Thu, 01 Jan 1970 00:00:00 GMT',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXNCO0FBRXRCLGtCQUFlO0lBQ2I7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFlBQW9CO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLElBQTZCO1FBQ2xDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBNkI7UUFDaEMsT0FBTyxhQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZUFBZSxFQUFFLCtCQUErQjtDQUNqRCxDQUFDIn0=