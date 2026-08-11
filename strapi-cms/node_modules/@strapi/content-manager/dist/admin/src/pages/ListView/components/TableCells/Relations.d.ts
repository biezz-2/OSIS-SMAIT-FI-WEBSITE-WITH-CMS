import type { CellContentProps } from './CellContent';
interface RelationSingleProps extends Pick<CellContentProps, 'mainField' | 'content'> {
}
declare const RelationSingle: ({ mainField, content }: RelationSingleProps) => import("react/jsx-runtime").JSX.Element;
interface RelationMultipleProps extends Pick<CellContentProps, 'mainField' | 'content' | 'name' | 'rowId'> {
}
declare const RelationMultiple: ({ mainField, content, rowId, name }: RelationMultipleProps) => import("react/jsx-runtime").JSX.Element;
export { RelationSingle, RelationMultiple };
export type { RelationSingleProps, RelationMultipleProps };
