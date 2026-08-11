import crc from 'crc';
export default {
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
        return crc.crc32(JSON.stringify(data));
    },
    CookieDateEpoch: 'Thu, 01 Jan 1970 00:00:00 GMT',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQztBQUV0QixlQUFlO0lBQ2I7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFlBQW9CO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLElBQTZCO1FBQ2xDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBNkI7UUFDaEMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZUFBZSxFQUFFLCtCQUErQjtDQUNqRCxDQUFDIn0=