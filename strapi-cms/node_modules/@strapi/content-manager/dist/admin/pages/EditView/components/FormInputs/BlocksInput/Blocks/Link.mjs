import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { Box, Button, Popover, Flex, Field } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { Editor, Transforms, Range, Path, Point, Element, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { styled } from 'styled-components';
import { useBlocksEditorContext } from '../BlocksEditor.mjs';

const isLinkNode = (element)=>{
    return element.type === 'link';
};
const removeLink = (editor)=>{
    Transforms.unwrapNodes(editor, {
        match: (node)=>!Editor.isEditor(node) && Element.isElement(node) && node.type === 'link'
    });
};
const insertLink = (editor, { url })=>{
    if (editor.selection) {
        // We want to remove all link on the selection
        const linkNodes = Array.from(Editor.nodes(editor, {
            at: editor.selection,
            match: (node)=>!Editor.isEditor(node) && node.type === 'link'
        }));
        linkNodes.forEach(([, path])=>{
            Transforms.unwrapNodes(editor, {
                at: path
            });
        });
        if (Range.isCollapsed(editor.selection)) {
            const link = {
                type: 'link',
                url: url ?? '',
                children: [
                    {
                        type: 'text',
                        text: url
                    }
                ],
                rel: '',
                target: ''
            };
            Transforms.insertNodes(editor, link);
        } else {
            Transforms.wrapNodes(editor, {
                type: 'link',
                url: url ?? ''
            }, {
                split: true
            });
        }
    }
};
const editLink = (editor, link)=>{
    const { url, text, rel, target } = link;
    if (!editor.selection) {
        return;
    }
    const linkEntry = Editor.above(editor, {
        match: (node)=>!Editor.isEditor(node) && node.type === 'link'
    });
    if (linkEntry) {
        const [, linkPath] = linkEntry;
        Transforms.setNodes(editor, {
            url,
            rel,
            target
        }, {
            at: linkPath
        });
        // If link text is different, we remove the old text and insert the new one
        if (text !== '' && text !== Editor.string(editor, linkPath)) {
            const linkNodeChildrens = Array.from(Node.children(editor, linkPath, {
                reverse: true
            }));
            linkNodeChildrens.forEach(([, childPath])=>{
                Transforms.removeNodes(editor, {
                    at: childPath
                });
            });
            Transforms.insertNodes(editor, [
                {
                    type: 'text',
                    text
                }
            ], {
                at: linkPath.concat(0)
            });
        }
    }
};
const StyledLink = styled(Box)`
  text-decoration: none;
`;
const RemoveButton = styled(Button)`
  visibility: ${(props)=>props.$visible ? 'visible' : 'hidden'};
`;
const LinkContent = /*#__PURE__*/ React.forwardRef(({ link, children, attributes }, forwardedRef)=>{
    const { formatMessage } = useIntl();
    const { editor } = useBlocksEditorContext('Link');
    const path = ReactEditor.findPath(editor, link);
    const [popoverOpen, setPopoverOpen] = React.useState(editor.lastInsertedLinkPath ? Path.equals(path, editor.lastInsertedLinkPath) : false);
    const elementText = link.children.map((child)=>child.text).join('');
    const [linkText, setLinkText] = React.useState(elementText);
    const [linkUrl, setLinkUrl] = React.useState(link.url);
    const [linkRel, setLinRel] = React.useState(link.rel);
    const [linkTarget, setLinkTarget] = React.useState(link.target);
    const linkInputRef = React.useRef(null);
    const isLastInsertedLink = editor.lastInsertedLinkPath ? !Path.equals(path, editor.lastInsertedLinkPath) : true;
    const [isSaveDisabled, setIsSaveDisabled] = React.useState(false);
    const onLinkChange = (e)=>{
        setIsSaveDisabled(false);
        setLinkUrl(e.target.value);
        try {
            // eslint-disable-next-line no-new
            new URL(e.target.value?.startsWith('/') ? `https://strapi.io${e.target.value}` : e.target.value);
        } catch (error) {
            setIsSaveDisabled(true);
        }
    };
    const onLinkRelChange = (e)=>{
        setIsSaveDisabled(false);
        setLinRel(e.target.value);
    };
    const onLinkTargetChange = (e)=>{
        setIsSaveDisabled(false);
        setLinkTarget(e.target.value);
    };
    const handleSave = (e)=>{
        e.stopPropagation();
        // If the selection is collapsed, we select the parent node because we want all the link to be replaced)
        if (editor.selection && Range.isCollapsed(editor.selection)) {
            const [, parentPath] = Editor.parent(editor, editor.selection.focus?.path);
            Transforms.select(editor, parentPath);
        }
        editLink(editor, {
            url: linkUrl,
            text: linkText,
            rel: linkRel,
            target: linkTarget
        });
        setPopoverOpen(false);
        editor.lastInsertedLinkPath = null;
        ReactEditor.focus(editor);
    };
    const handleClose = ()=>{
        if (link.url === '') {
            removeLink(editor);
        }
        setPopoverOpen(false);
        ReactEditor.focus(editor);
    };
    React.useEffect(()=>{
        // Focus on the link input element when the popover opens
        if (popoverOpen) linkInputRef.current?.focus();
    }, [
        popoverOpen
    ]);
    const inputNotDirty = !linkText || !linkUrl || link.url && link.url === linkUrl && elementText && elementText === linkText && link.rel === linkRel && link.target === linkTarget;
    return /*#__PURE__*/ jsxs(Popover.Root, {
        open: popoverOpen,
        children: [
            /*#__PURE__*/ jsx(Popover.Trigger, {
                children: /*#__PURE__*/ jsx(StyledLink, {
                    ...attributes,
                    ref: forwardedRef,
                    tag: "a",
                    href: link.url,
                    rel: link.rel,
                    target: link.target,
                    onClick: ()=>setPopoverOpen(true),
                    color: "primary600",
                    children: children
                })
            }),
            /*#__PURE__*/ jsx(Popover.Content, {
                onPointerDownOutside: handleClose,
                children: /*#__PURE__*/ jsxs(Flex, {
                    padding: 4,
                    direction: "column",
                    gap: 4,
                    children: [
                        /*#__PURE__*/ jsx(Field.Root, {
                            width: {
                                initial: '100%',
                                medium: '368px'
                            },
                            children: /*#__PURE__*/ jsxs(Flex, {
                                direction: "column",
                                gap: 1,
                                alignItems: "stretch",
                                children: [
                                    /*#__PURE__*/ jsx(Field.Label, {
                                        children: formatMessage({
                                            id: 'components.Blocks.popover.text',
                                            defaultMessage: 'Text'
                                        })
                                    }),
                                    /*#__PURE__*/ jsx(Field.Input, {
                                        name: "text",
                                        placeholder: formatMessage({
                                            id: 'components.Blocks.popover.text.placeholder',
                                            defaultMessage: 'Enter link text'
                                        }),
                                        value: linkText,
                                        onChange: (e)=>{
                                            setLinkText(e.target.value);
                                        }
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx(Field.Root, {
                            width: {
                                initial: '100%',
                                medium: '368px'
                            },
                            children: /*#__PURE__*/ jsxs(Flex, {
                                direction: "column",
                                gap: 1,
                                alignItems: "stretch",
                                children: [
                                    /*#__PURE__*/ jsx(Field.Label, {
                                        children: formatMessage({
                                            id: 'components.Blocks.popover.link',
                                            defaultMessage: 'Link'
                                        })
                                    }),
                                    /*#__PURE__*/ jsx(Field.Input, {
                                        ref: linkInputRef,
                                        name: "url",
                                        placeholder: formatMessage({
                                            id: 'components.Blocks.popover.link.placeholder',
                                            defaultMessage: 'Paste link'
                                        }),
                                        value: linkUrl,
                                        onChange: onLinkChange
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx(Field.Root, {
                            width: {
                                initial: '100%',
                                medium: '368px'
                            },
                            children: /*#__PURE__*/ jsxs(Flex, {
                                direction: "column",
                                gap: 1,
                                alignItems: "stretch",
                                children: [
                                    /*#__PURE__*/ jsx(Field.Label, {
                                        children: formatMessage({
                                            id: 'components.Blocks.popover.link.rel',
                                            defaultMessage: 'Rel (optional)'
                                        })
                                    }),
                                    /*#__PURE__*/ jsx(Field.Input, {
                                        name: "rel",
                                        placeholder: formatMessage({
                                            id: 'components.Blocks.popover.link.rel.placeholder',
                                            defaultMessage: 'noopener, nofollow, noreferrer'
                                        }),
                                        value: linkRel,
                                        onChange: onLinkRelChange
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx(Field.Root, {
                            width: {
                                initial: '100%',
                                medium: '368px'
                            },
                            children: /*#__PURE__*/ jsxs(Flex, {
                                direction: "column",
                                gap: 1,
                                alignItems: "stretch",
                                children: [
                                    /*#__PURE__*/ jsx(Field.Label, {
                                        children: formatMessage({
                                            id: 'components.Blocks.popover.link.target',
                                            defaultMessage: 'Target (optional)'
                                        })
                                    }),
                                    /*#__PURE__*/ jsx(Field.Input, {
                                        name: "target",
                                        placeholder: formatMessage({
                                            id: 'components.Blocks.popover.link.target.placeholder',
                                            defaultMessage: '_blank, _self, _parent, _top'
                                        }),
                                        value: linkTarget,
                                        onChange: onLinkTargetChange
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsxs(Flex, {
                            justifyContent: "space-between",
                            width: {
                                initial: '100%',
                                medium: '368px'
                            },
                            children: [
                                /*#__PURE__*/ jsx(RemoveButton, {
                                    variant: "danger-light",
                                    onClick: ()=>removeLink(editor),
                                    $visible: isLastInsertedLink,
                                    children: formatMessage({
                                        id: 'components.Blocks.popover.remove',
                                        defaultMessage: 'Remove'
                                    })
                                }),
                                /*#__PURE__*/ jsxs(Flex, {
                                    gap: 2,
                                    children: [
                                        /*#__PURE__*/ jsx(Button, {
                                            variant: "tertiary",
                                            onClick: handleClose,
                                            children: formatMessage({
                                                id: 'global.cancel',
                                                defaultMessage: 'Cancel'
                                            })
                                        }),
                                        /*#__PURE__*/ jsx(Button, {
                                            disabled: Boolean(inputNotDirty) || isSaveDisabled,
                                            onClick: handleSave,
                                            children: formatMessage({
                                                id: 'global.save',
                                                defaultMessage: 'Save'
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
});
const Link = /*#__PURE__*/ React.forwardRef((props, forwardedRef)=>{
    if (!isLinkNode(props.element)) {
        return null;
    }
    // LinkContent uses React hooks that rely on props.element being a link. If the type guard above
    // doesn't pass, those hooks would be called conditionnally, which is not allowed.
    // Hence the need for a separate component.
    return /*#__PURE__*/ jsx(LinkContent, {
        ...props,
        link: props.element,
        ref: forwardedRef
    });
});
const withLinks = (editor)=>{
    const { isInline, apply, insertText, insertData } = editor;
    // Links are inline elements, so we need to override the isInline method for slate
    editor.isInline = (element)=>{
        return element.type === 'link' ? true : isInline(element);
    };
    // We keep a track of the last inserted link path
    // So we can show the popover on the link component if that link is the last one inserted
    editor.lastInsertedLinkPath = null;
    // We intercept the apply method, so everytime we insert a new link, we save its path
    editor.apply = (operation)=>{
        if (operation.type === 'insert_node') {
            if (!Editor.isEditor(operation.node) && operation.node.type === 'link' && editor.shouldSaveLinkPath) {
                editor.lastInsertedLinkPath = operation.path;
            }
        } else if (operation.type === 'move_node') {
            // We need to update the last inserted link path when link is moved
            // If link is the first word in the paragraph we dont need to update the path
            if (Path.hasPrevious(operation.path) && editor.lastInsertedLinkPath && editor.shouldSaveLinkPath) {
                editor.lastInsertedLinkPath = Path.transform(editor.lastInsertedLinkPath, operation);
            }
        }
        apply(operation);
    };
    editor.insertText = (text)=>{
        // When selection is at the end of a link and user types a space, we want to break the link
        if (editor.selection && Range.isCollapsed(editor.selection) && text === ' ') {
            const linksInSelection = Array.from(Editor.nodes(editor, {
                at: editor.selection,
                match: (node)=>!Editor.isEditor(node) && node.type === 'link'
            }));
            const selectionIsInLink = editor.selection && linksInSelection.length > 0;
            const selectionIsAtEndOfLink = selectionIsInLink && Point.equals(editor.selection.anchor, Editor.end(editor, linksInSelection[0][1]));
            if (selectionIsAtEndOfLink) {
                Transforms.insertNodes(editor, {
                    text: ' ',
                    type: 'text'
                }, {
                    at: Path.next(linksInSelection[0][1]),
                    select: true
                });
                return;
            }
        }
        insertText(text);
    };
    // Add data as a clickable link if its a valid URL
    editor.insertData = (data)=>{
        const pastedText = data.getData('text/plain');
        if (pastedText) {
            try {
                // eslint-disable-next-line no-new
                new URL(pastedText);
                // Do not show link popup on copy-paste a link, so do not save its path
                editor.shouldSaveLinkPath = false;
                insertLink(editor, {
                    url: pastedText
                });
                return;
            } catch (error) {
            // continue normal data insertion
            }
        }
        insertData(data);
    };
    return editor;
};
const linkBlocks = {
    link: {
        renderElement: (props)=>/*#__PURE__*/ jsx(Link, {
                element: props.element,
                attributes: props.attributes,
                children: props.children
            }),
        // No handleConvert here, links are created via the link button in the toolbar
        matchNode: (node)=>node.type === 'link',
        isInBlocksSelector: false,
        plugin: withLinks,
        isDraggable: ()=>false
    }
};

export { insertLink, linkBlocks };
//# sourceMappingURL=Link.mjs.map
