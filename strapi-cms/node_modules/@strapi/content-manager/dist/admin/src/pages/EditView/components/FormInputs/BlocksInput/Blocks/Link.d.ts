import { BaseEditor, Editor, Path } from 'slate';
import { type BlocksStore } from '../BlocksEditor';
declare const insertLink: (editor: Editor, { url }: {
    url: string;
}) => void;
declare const linkBlocks: Pick<BlocksStore, 'link'>;
export interface LinkEditor extends BaseEditor {
    lastInsertedLinkPath: Path | null;
    shouldSaveLinkPath: boolean;
}
export { linkBlocks, insertLink };
