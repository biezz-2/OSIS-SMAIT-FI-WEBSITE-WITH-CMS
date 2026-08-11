//#region src/plugins/username/schema.d.ts
declare const getSchema: (normalizer: {
  username: (username: string) => string;
  displayUsername: (displayUsername: string) => string;
}) => {
  user: {
    fields: {
      username: {
        type: "string";
        required: false;
        sortable: true;
        unique: true;
        returned: true;
        transform: {
          input(value: import("@better-auth/core/db").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
        };
      };
      displayUsername: {
        type: "string";
        required: false;
        transform: {
          input(value: import("@better-auth/core/db").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
        };
      };
    };
  };
};
type UsernameSchema = ReturnType<typeof getSchema>;
//#endregion
export { UsernameSchema, getSchema };