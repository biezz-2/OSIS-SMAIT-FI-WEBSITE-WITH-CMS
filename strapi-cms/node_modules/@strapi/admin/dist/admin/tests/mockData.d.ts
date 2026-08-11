declare const mockData: {
    readonly webhooks: readonly [{
        readonly id: 1;
        readonly isEnabled: true;
        readonly name: "test";
        readonly url: "http:://strapi.io";
    }, {
        readonly id: 2;
        readonly isEnabled: false;
        readonly name: "test2";
        readonly url: "http://me.io";
    }];
};
type MockData = typeof mockData;
export { mockData };
export type { MockData };
