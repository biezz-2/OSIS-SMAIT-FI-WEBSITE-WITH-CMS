import { yup } from '@strapi/utils';
declare const uploadSchema: import("yup/lib/object").OptionalObjectSchema<{
    fileInfo: import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    fileInfo: import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>>;
}>>;
declare const multiUploadSchema: import("yup/lib/object").OptionalObjectSchema<{
    fileInfo: yup.ArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>[] | undefined, import("yup/lib/object").AssertsShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>[] | undefined>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    fileInfo: yup.ArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>[] | undefined, import("yup/lib/object").AssertsShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>[] | undefined>;
}>>;
declare const validateUploadBody: (data?: {}, isMulti?: boolean) => Promise<import("yup/lib/object").AssertsShape<{
    fileInfo: import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>>;
}> | import("yup/lib/object").AssertsShape<{
    fileInfo: yup.ArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>[] | undefined, import("yup/lib/object").AssertsShape<{
        name: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        alternativeText: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        caption: import("yup").StringSchema<string | null | undefined, Record<string, any>, string | null | undefined>;
        focalPoint: import("yup").ObjectSchema<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null, import("yup/lib/object").AssertsShape<{
            x: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
            y: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        }> | null>;
    }>[] | undefined>;
}>>;
export { validateUploadBody };
export type UploadBody = yup.InferType<typeof uploadSchema> | yup.InferType<typeof multiUploadSchema>;
//# sourceMappingURL=upload.d.ts.map