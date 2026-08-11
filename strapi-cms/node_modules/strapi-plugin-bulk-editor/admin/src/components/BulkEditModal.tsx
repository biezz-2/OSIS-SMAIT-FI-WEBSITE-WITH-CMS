import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Box,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@strapi/design-system';

interface FieldSchema {
  type: string;
  enum?: string[];
  default?: any;
  required?: boolean;
}

interface ContentTypeSchema {
  attributes: Record<string, FieldSchema>;
  options?: {
    draftAndPublish?: boolean;
  };
  pluralName?: string;
}

interface BulkEditModalProps {
  documents: any[];
  contentType: string;
  onClose: () => void;
  notificationFn: any;
  fetchClient: any;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  documents,
  contentType,
  onClose,
  notificationFn,
  fetchClient,
}) => {
  const [editedEntries, setEditedEntries] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [schema, setSchema] = useState<ContentTypeSchema | null>(null);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [dragStart, setDragStart] = useState<{ docId: string; field: string } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ docId: string; field: string } | null>(null);
  const [relationOptions, setRelationOptions] = useState<Record<string, any[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [populatingRelations, setPopulatingRelations] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ docId: string; field: string } | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  // Helper to create cell key
  const getCellKey = (docId: string, field: string) => `${docId}:${field}`;

  // Fetch content type schema
  useEffect(() => {
    const fetchSchema = async () => {
      setSchemaLoading(true);
      try {
        const configResponse = await fetchClient.get(`/content-manager/content-types/${contentType}/configuration`);
        const builderResponse = await fetchClient.get(`/content-type-builder/content-types/${contentType}`);

        let schemaData = null;

        if (builderResponse.data?.data?.schema?.attributes) {
          const rawSchema = builderResponse.data.data.schema;
          schemaData = {
            attributes: rawSchema.attributes,
            pluralName: rawSchema.pluralName,
            options: {
              draftAndPublish: rawSchema.draftAndPublish || rawSchema.options?.draftAndPublish || false,
            },
          };
        } else if (builderResponse.data?.schema?.attributes) {
          const rawSchema = builderResponse.data.schema;
          schemaData = {
            attributes: rawSchema.attributes,
            pluralName: rawSchema.pluralName,
            options: {
              draftAndPublish: rawSchema.draftAndPublish || rawSchema.options?.draftAndPublish || false,
            },
          };
        } else if (configResponse.data?.data?.contentType?.attributes) {
          const rawSchema = configResponse.data.data.contentType;
          schemaData = {
            attributes: rawSchema.attributes,
            pluralName: rawSchema.pluralName,
            options: {
              draftAndPublish: rawSchema.draftAndPublish || rawSchema.options?.draftAndPublish || false,
            },
          };
        } else if (configResponse.data?.data?.schema?.attributes) {
          const rawSchema = configResponse.data.data.schema;
          schemaData = {
            attributes: rawSchema.attributes,
            pluralName: rawSchema.pluralName,
            options: {
              draftAndPublish: rawSchema.draftAndPublish || rawSchema.options?.draftAndPublish || false,
            },
          };
        } else if (configResponse.data?.contentType?.attributes) {
          const rawSchema = configResponse.data.contentType;
          schemaData = {
            attributes: rawSchema.attributes,
            pluralName: rawSchema.pluralName,
            options: {
              draftAndPublish: rawSchema.draftAndPublish || rawSchema.options?.draftAndPublish || false,
            },
          };
        }

        if (schemaData) {
          setSchema(schemaData);
        }
      } catch (error) {
        console.error('Failed to fetch schema:', error);
      } finally {
        setSchemaLoading(false);
      }
    };

    fetchSchema();
  }, [contentType, fetchClient]);

  // Fetch relation options when schema is loaded
  useEffect(() => {
    const fetchRelationOptions = async () => {
      if (!schema) return;

      const relationFields = Object.entries(schema.attributes || {})
        .filter(([_, fieldSchema]) => fieldSchema.type === 'relation')
        .map(([fieldName, fieldSchema]) => ({ fieldName, fieldSchema }));

      if (relationFields.length === 0) return;

      const options: Record<string, any[]> = {};

      for (const { fieldName, fieldSchema } of relationFields) {
        try {
          const targetContentType = (fieldSchema as any).target;
          if (!targetContentType) continue;

          const response = await fetchClient.get(
            `/content-manager/collection-types/${targetContentType}?page=1&pageSize=100`
          );

          if (response.data?.results) {
            options[fieldName] = response.data.results;
          }
        } catch (error) {
          // Silently handle relation fetch errors
        }
      }

      setRelationOptions(options);
    };

    fetchRelationOptions();
  }, [schema, fetchClient]);

  // Global mouse up listener for drag-to-fill
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragStart) {
        handleDragEnd();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart, dragCurrent]);

  // Populate unpopulated relations
  useEffect(() => {
    const populateRelations = async () => {
      if (!schema || documents.length === 0) return;

      setPopulatingRelations(true);
      const docIdsNeedingPopulation: string[] = [];

      documents.forEach((doc) => {
        const docId = doc.documentId || doc.id;
        if (!docId) return;

        Object.keys(doc).forEach((key) => {
          const isRelationField = schema.attributes?.[key]?.type === 'relation';
          if (isRelationField && typeof doc[key] === 'object' && doc[key] !== null && 'count' in doc[key]) {
            if (!docIdsNeedingPopulation.includes(docId)) {
              docIdsNeedingPopulation.push(docId);
            }
          }
        });
      });

      if (docIdsNeedingPopulation.length > 0) {
        try {
          const response = await fetchClient.post('/bulk-editor/get-populated', {
            contentType,
            documentIds: docIdsNeedingPopulation,
          });

          const populatedDocs = response.data?.documents || [];

          const updatedDocuments = documents.map((doc) => {
            const docId = doc.documentId || doc.id;
            const populated = populatedDocs.find((pd: any) => (pd.documentId || pd.id) === docId);
            return populated || doc;
          });

          initializeEntries(updatedDocuments);
        } catch (error) {
          initializeEntries(documents);
        }
      } else {
        initializeEntries(documents);
      }
    };

    const initializeEntries = (docs: any[]) => {
      const initial: Record<string, any> = {};
      docs.forEach((doc) => {
        const docId = doc.documentId || doc.id;
        if (docId) {
          const docCopy = { ...doc };

          Object.keys(docCopy).forEach((key) => {
            if (Array.isArray(docCopy[key])) {
              docCopy[key] = [...docCopy[key]];
            } else if (typeof docCopy[key] === 'object' && docCopy[key] !== null && 'count' in docCopy[key]) {
              docCopy[key] = [];
            }
          });

          if (schema?.attributes) {
            Object.entries(schema.attributes).forEach(([key, fieldSchema]) => {
              if (fieldSchema.type === 'relation') {
                if (!(key in docCopy) || docCopy[key] === undefined) {
                  const relationField = fieldSchema as any;
                  const isManyRelation = relationField.relation?.includes('ToMany') || relationField.relation === 'manyToMany';
                  docCopy[key] = isManyRelation ? [] : null;
                }
              }
            });
          }

          initial[docId] = docCopy;
        }
      });
      setEditedEntries(initial);
      setPopulatingRelations(false);
    };

    populateRelations();
  }, [documents, schema, contentType, fetchClient]);

  // Get editable fields
  const getEditableFields = () => {
    if (documents.length === 0) return [];

    const doc = documents[0];
    const excludeFields = [
      'id',
      'documentId',
      'createdAt',
      'updatedAt',
      'publishedAt',
      'createdBy',
      'updatedBy',
      'locale',
      'localizations',
      'status',
    ];

    return Object.keys(doc).filter((key) => {
      const value = doc[key];

      if (excludeFields.includes(key)) return false;

      if (schema?.attributes?.[key]) {
        const fieldSchema = schema.attributes[key];
        if (
          fieldSchema.type === 'component' ||
          fieldSchema.type === 'dynamiczone'
        ) {
          return false;
        }
        return true;
      }

      if (typeof value === 'object' && value !== null) return false;
      if (Array.isArray(value)) return false;

      return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
      );
    });
  };

  const fields = getEditableFields();

  const getFieldType = (field: string): FieldSchema | null => {
    return schema?.attributes?.[field] || null;
  };

  const handleFieldChange = (docId: string | number, field: string, value: any) => {
    const cellKey = getCellKey(String(docId), field);

    // Get all cells to update (current cell + any selected cells in same column)
    const cellsToUpdate = new Set<string>();
    cellsToUpdate.add(cellKey);

    // Add selected cells that are in the same column
    selectedCells.forEach((selectedKey) => {
      const [, selectedField] = selectedKey.split(':');
      if (selectedField === field) {
        cellsToUpdate.add(selectedKey);
      }
    });

    setEditedEntries((prev) => {
      const updated = { ...prev };
      cellsToUpdate.forEach((key) => {
        const [targetDocId] = key.split(':');
        updated[targetDocId] = {
          ...updated[targetDocId],
          [field]: value,
        };
      });
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Handler for many-to-many incremental changes (add/remove single item across selected cells)
  const handleManyToManyChange = (docId: string | number, field: string, itemId: number, operation: 'add' | 'remove') => {
    const cellKey = getCellKey(String(docId), field);

    // Get all cells to update (current cell + any selected cells in same column)
    const cellsToUpdate = new Set<string>();
    cellsToUpdate.add(cellKey);

    // Add selected cells that are in the same column
    selectedCells.forEach((selectedKey) => {
      const [, selectedField] = selectedKey.split(':');
      if (selectedField === field) {
        cellsToUpdate.add(selectedKey);
      }
    });

    setEditedEntries((prev) => {
      const updated = { ...prev };
      cellsToUpdate.forEach((key) => {
        const [targetDocId] = key.split(':');
        const currentValue = updated[targetDocId]?.[field];

        // Get current IDs for this specific cell
        const currentIds = Array.isArray(currentValue)
          ? currentValue.map((item: any) =>
              typeof item === 'object' && item?.id ? item.id : typeof item === 'number' ? item : null
            ).filter((id): id is number => id !== null)
          : [];

        let newIds: number[];
        if (operation === 'add') {
          // Add the item if not already present
          newIds = currentIds.includes(itemId) ? currentIds : [...currentIds, itemId];
        } else {
          // Remove the item
          newIds = currentIds.filter((id) => id !== itemId);
        }

        updated[targetDocId] = {
          ...updated[targetDocId],
          [field]: newIds,
        };
      });
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Cell click handler for multi-select
  const handleCellClick = (e: React.MouseEvent, docId: string, field: string) => {
    const cellKey = getCellKey(docId, field);
    const docIds = documents.map((doc) => doc.documentId || doc.id).filter(Boolean);
    const isThisCellSelected = selectedCells.has(cellKey);

    // Check if clicking on an interactive element (input, select, button, option)
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isInteractiveElement = tagName === 'input' || tagName === 'select' || tagName === 'button' || tagName === 'option';

    if (e.shiftKey) {
      // Shift+click (with or without Cmd): select range from last selected to current (same column)
      e.preventDefault(); // Prevent text selection

      setSelectedCells((prev) => {
        const newSet = new Set<string>();

        // Find the last selected cell in this column
        let lastSelectedIndex = -1;
        prev.forEach((key) => {
          const [keyDocId, keyField] = key.split(':');
          if (keyField === field) {
            const idx = docIds.indexOf(keyDocId);
            if (idx > lastSelectedIndex) {
              lastSelectedIndex = idx;
            }
          }
        });

        // Copy existing selections from same column
        prev.forEach((key) => {
          const [, keyField] = key.split(':');
          if (keyField === field) {
            newSet.add(key);
          }
        });

        // If we have a previous selection, select the range
        const currentIndex = docIds.indexOf(docId);
        if (lastSelectedIndex !== -1 && currentIndex !== -1) {
          const [minIndex, maxIndex] = [Math.min(lastSelectedIndex, currentIndex), Math.max(lastSelectedIndex, currentIndex)];
          for (let i = minIndex; i <= maxIndex; i++) {
            newSet.add(getCellKey(docIds[i], field));
          }
        } else {
          newSet.add(cellKey);
        }

        return newSet;
      });
    } else if (e.metaKey || e.ctrlKey) {
      // Cmd/Ctrl+click: toggle selection, add to existing (same column only)
      e.preventDefault(); // Prevent text selection

      setSelectedCells((prev) => {
        const newSet = new Set<string>();

        // Keep only cells from the same column
        prev.forEach((key) => {
          const [, keyField] = key.split(':');
          if (keyField === field) {
            newSet.add(key);
          }
        });

        if (newSet.has(cellKey)) {
          newSet.delete(cellKey);
        } else {
          newSet.add(cellKey);
        }
        return newSet;
      });
    } else if (isInteractiveElement && isThisCellSelected) {
      // Clicking on input/select in an already-selected cell: keep selection
      return;
    } else {
      // Regular click (or clicking on input in unselected cell): select only this cell
      setSelectedCells(new Set([cellKey]));
    }
  };

  // Drag-to-fill handlers
  const handleDragStart = (e: React.MouseEvent, docId: string, field: string) => {
    e.preventDefault();
    setDragStart({ docId, field });
    setDragCurrent({ docId, field });
  };

  const handleDragOver = (docId: string, field: string) => {
    if (dragStart && dragStart.field === field) {
      setDragCurrent({ docId, field });
    }
  };

  const handleDragEnd = () => {
    if (dragStart && dragCurrent && dragStart.field === dragCurrent.field) {
      const docIds = documents.map((doc) => doc.documentId || doc.id).filter(Boolean);
      const startIndex = docIds.indexOf(dragStart.docId);
      const endIndex = docIds.indexOf(dragCurrent.docId);

      if (startIndex !== -1 && endIndex !== -1) {
        const [minIndex, maxIndex] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
        const affectedDocIds = docIds.slice(minIndex, maxIndex + 1);

        setEditedEntries((prev) => {
          let sourceValue = prev[dragStart.docId]?.[dragStart.field];

          const fieldSchema = getFieldType(dragStart.field);
          if (fieldSchema?.type === 'relation') {
            const relationField = fieldSchema as any;
            const isManyRelation = relationField.relation?.includes('ToMany') || relationField.relation?.includes('manyToMany');

            if (isManyRelation) {
              if (Array.isArray(sourceValue)) {
                sourceValue = sourceValue.map((item: any) =>
                  typeof item === 'object' && item?.id ? item.id : typeof item === 'number' ? item : null
                ).filter((id): id is number => id !== null);
              } else {
                sourceValue = [];
              }
            } else {
              if (typeof sourceValue === 'object' && sourceValue?.id) {
                sourceValue = sourceValue.id;
              }
            }
          }

          const updated = { ...prev };
          affectedDocIds.forEach((docId) => {
            updated[docId] = {
              ...updated[docId],
              [dragStart.field]: sourceValue,
            };
          });

          return updated;
        });

        setHasUnsavedChanges(true);
      }
    }

    setDragStart(null);
    setDragCurrent(null);
  };

  const isInDragSelection = (docId: string, field: string): boolean => {
    if (!dragStart || !dragCurrent || dragStart.field !== field) return false;

    const docIds = documents.map((doc) => doc.documentId || doc.id).filter(Boolean);
    const startIndex = docIds.indexOf(dragStart.docId);
    const currentIndex = docIds.indexOf(dragCurrent.docId);
    const thisIndex = docIds.indexOf(docId);

    const [minIndex, maxIndex] = [Math.min(startIndex, currentIndex), Math.max(startIndex, currentIndex)];
    return thisIndex >= minIndex && thisIndex <= maxIndex;
  };

  // Check if cell is selected
  const isCellSelected = (docId: string, field: string): boolean => {
    return selectedCells.has(getCellKey(docId, field));
  };

  // Render appropriate input based on field type
  const renderFieldInput = (docId: string, field: string, value: any, fieldSchema: FieldSchema | null, isLoading: boolean) => {
    const onChange = (newValue: any) => handleFieldChange(docId, field, newValue);

    const disabledStyle = isLoading ? {
      opacity: 0.5,
      pointerEvents: 'none' as const,
      backgroundColor: '#f6f6f9',
    } : {};

    // Handle relation fields
    if (fieldSchema?.type === 'relation') {
      const options = relationOptions[field] || [];
      const relationField = fieldSchema as any;
      const isManyRelation = relationField.relation?.includes('ToMany') || relationField.relation?.includes('manyToMany');

      if (isManyRelation) {
        const selectedIds = Array.isArray(value)
          ? value.map((item: any) => (typeof item === 'object' && item?.id ? item.id : typeof item === 'number' ? item : null)).filter((id): id is number => id !== null)
          : [];

        const selectedItems = options.filter((opt) =>
          selectedIds.includes(opt.id)
        );

        return (
          <div style={{ width: '100%', minWidth: '150px', ...disabledStyle }}>
            {selectedItems.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '4px',
                }}
              >
                {selectedItems.map((item) => (
                  <span
                    key={item.documentId || item.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      backgroundColor: '#e0f2ff',
                      border: '1px solid #4945ff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#4945ff',
                    }}
                  >
                    {item.title || item.name || `#${item.id}`}
                    <button
                      onClick={() => {
                        handleManyToManyChange(docId, field, item.id, 'remove');
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '14px',
                        color: '#4945ff',
                        fontWeight: 'bold',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <select
              value=""
              onChange={(e) => {
                const selectedId = e.target.value ? parseInt(e.target.value, 10) : null;
                if (selectedId) {
                  handleManyToManyChange(docId, field, selectedId, 'add');
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #dcdce4',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: isLoading ? '#f6f6f9' : 'white',
                cursor: 'default',
              }}
              disabled={isLoading}
            >
              <option value="">+ Add...</option>
              {options
                .filter((opt) => !selectedIds.includes(opt.id))
                .map((option) => (
                  <option key={option.documentId || option.id} value={option.id}>
                    {option.title || option.name || `#${option.id}`}
                  </option>
                ))}
            </select>
          </div>
        );
      }

      const currentValue = typeof value === 'object' && value?.id
        ? value.id
        : typeof value === 'number'
        ? value
        : '';

      return (
        <select
          value={currentValue}
          onChange={(e) => {
            const selectedId = e.target.value ? parseInt(e.target.value, 10) : null;
            onChange(selectedId);
          }}
          style={{
            width: '100%',
            minWidth: '120px',
            padding: '8px',
            border: '1px solid #dcdce4',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: isLoading ? '#f6f6f9' : 'white',
            cursor: 'default',
            ...disabledStyle,
          }}
          disabled={isLoading}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.documentId || option.id} value={option.id}>
              {option.title || option.name || `#${(option.documentId || option.id).slice(0, 8)}`}
            </option>
          ))}
        </select>
      );
    }

    // Handle enumeration fields
    if (fieldSchema?.type === 'enumeration' && fieldSchema.enum) {
      return (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          style={{
            width: '100%',
            minWidth: '120px',
            padding: '8px',
            border: '1px solid #dcdce4',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: isLoading ? '#f6f6f9' : 'white',
            cursor: 'default',
            ...disabledStyle,
          }}
          disabled={isLoading}
        >
          <option value=""></option>
          {fieldSchema.enum.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // Handle media fields (read-only preview)
    if (fieldSchema?.type === 'media') {
      const mediaUrl = typeof value === 'object' && value?.url
        ? value.url
        : typeof value === 'string'
        ? value
        : null;

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#f6f6f9',
            border: '1px solid #dcdce4',
            overflow: 'hidden',
            margin: '0 auto',
            ...disabledStyle,
          }}
        >
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Typography variant="pi" textColor="neutral400">
              —
            </Typography>
          )}
        </div>
      );
    }

    // Handle boolean fields
    if (fieldSchema?.type === 'boolean' || typeof value === 'boolean') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            ...disabledStyle,
          }}
        >
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              cursor: isLoading ? 'default' : 'pointer',
            }}
            disabled={isLoading}
          />
        </div>
      );
    }

    // Handle date/datetime fields
    if (fieldSchema?.type === 'date' || fieldSchema?.type === 'datetime') {
      const dateValue = value ? new Date(value).toISOString().slice(0, 10) : '';
      return (
        <input
          type="date"
          value={dateValue}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          style={{
            width: '100%',
            minWidth: '140px',
            padding: '8px',
            border: '1px solid #dcdce4',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: isLoading ? '#f6f6f9' : 'white',
            ...disabledStyle,
          }}
          disabled={isLoading}
        />
      );
    }

    // Handle number fields
    if (
      fieldSchema?.type === 'integer' ||
      fieldSchema?.type === 'biginteger' ||
      fieldSchema?.type === 'decimal' ||
      fieldSchema?.type === 'float' ||
      typeof value === 'number'
    ) {
      return (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(isNaN(parsed) ? null : parsed);
          }}
          step={fieldSchema?.type === 'decimal' || fieldSchema?.type === 'float' ? '0.01' : '1'}
          style={{
            width: '100%',
            minWidth: '120px',
            padding: '8px',
            border: '1px solid #dcdce4',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: isLoading ? '#f6f6f9' : 'white',
            ...disabledStyle,
          }}
          disabled={isLoading}
        />
      );
    }

    // Handle text/string fields (default)
    return (
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          minWidth: '120px',
          padding: '8px',
          border: '1px solid #dcdce4',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: isLoading ? '#f6f6f9' : 'white',
          ...disabledStyle,
        }}
        disabled={isLoading}
      />
    );
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onClose();
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSave = async (shouldPublish: boolean = false) => {
    setSaving(true);
    try {
      const updates = Object.entries(editedEntries).map(([id, data]) => {
        const cleanData: Record<string, any> = {};

        const excludeFields = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt',
                              'createdBy', 'updatedBy', 'locale', 'localizations', 'status'];

        fields.forEach((field) => {
          if (field in data && !excludeFields.includes(field)) {
            let value = data[field];

            const fieldSchema = getFieldType(field);

            if (fieldSchema?.type === 'media') {
              return;
            }

            if (fieldSchema?.type === 'relation') {
              const relationField = fieldSchema as any;
              const isManyRelation = relationField.relation?.includes('ToMany') || relationField.relation?.includes('manyToMany');

              if (isManyRelation) {
                if (Array.isArray(value)) {
                  value = value.map((item: any) =>
                    typeof item === 'object' && item?.id ? item.id : typeof item === 'number' ? item : null
                  ).filter((id): id is number => id !== null);
                } else {
                  value = [];
                }
              } else {
                if (typeof value === 'object' && value?.id) {
                  value = value.id;
                }
                if (value === '' || value === null || value === undefined) {
                  value = null;
                }
              }
            }

            cleanData[field] = value;
          }
        });

        return {
          id,
          data: cleanData,
        };
      });

      const response = await fetchClient.post('/bulk-editor/bulk-update', {
        contentType,
        updates,
        publish: shouldPublish,
      });

      if (response.data?.success) {
        const successCount = response.data.results.filter((r: any) => r.success).length;
        const failCount = response.data.results.filter((r: any) => !r.success).length;
        const action = shouldPublish ? 'Published' : 'Updated';

        if (notificationFn && typeof notificationFn.toggleNotification === 'function') {
          notificationFn.toggleNotification({
            type: successCount === updates.length ? 'success' : 'warning',
            message: `${action} ${successCount} entries${failCount > 0 ? `, ${failCount} failed` : ''}`,
          });
        } else if (typeof notificationFn === 'function') {
          notificationFn({
            type: successCount === updates.length ? 'success' : 'warning',
            message: `${action} ${successCount} entries${failCount > 0 ? `, ${failCount} failed` : ''}`,
          });
        }

        setHasUnsavedChanges(false);
        onClose();
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Bulk update error:', error);

      if (notificationFn && typeof notificationFn.toggleNotification === 'function') {
        notificationFn.toggleNotification({
          type: 'danger',
          message: error?.response?.data?.error?.message || error?.message || 'Failed to update entries',
        });
      } else if (typeof notificationFn === 'function') {
        notificationFn({
          type: 'danger',
          message: error?.response?.data?.error?.message || error?.message || 'Failed to update entries',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal.Root open onOpenChange={handleClose}>
        <Modal.Content
          style={{
            width: '90vw',
            maxWidth: '1400px',
          }}
        >
        <Modal.Header>
          <Box>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              Bulk Edit - {documents.length} {documents.length === 1 ? 'entry' : 'entries'}
            </Typography>
            <Typography variant="omega" textColor="neutral600" marginTop={1}>
              Drag the corner handle to fill values down. Cmd+click cells in same column to select multiple.
              {(schemaLoading || populatingRelations) && ' Loading...'}
            </Typography>
            {!schemaLoading && (
              <Typography variant="pi" textColor="neutral500" marginTop={2}>
                Note: Media fields are read-only previews. Edit them individually in each entry.
              </Typography>
            )}
          </Box>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: 0,
            margin: 0,
          }}
        >
          <Box
            style={{
              maxHeight: '60vh',
              overflow: 'auto',
              border: '1px solid #dcdce4',
              borderRadius: '4px',
              padding: 0,
              margin: 0,
            }}
          >
            {fields.length === 0 ? (
              <Typography style={{ padding: '20px' }}>No editable fields found for these entries.</Typography>
            ) : (
              <Table
                colCount={fields.length + 1}
                rowCount={documents.length + 1}
                style={{
                  width: '100%',
                  tableLayout: 'auto',
                }}
              >
                <Thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#f6f6f9',
                    zIndex: 1,
                  }}
                >
                  <Tr>
                    <Th
                      style={{
                        borderRight: '1px solid #dcdce4',
                        borderBottom: '2px solid #dcdce4',
                        backgroundColor: '#f6f6f9',
                        width: '100px',
                      }}
                    >
                      <Typography variant="sigma" textColor="neutral600">
                        ID
                      </Typography>
                    </Th>
                    {fields.map((field) => {
                      const fieldSchema = getFieldType(field);
                      const headerTextWidth = field.length * 8 + 20;

                      let minWidth = Math.max(headerTextWidth, 100);
                      let maxWidth = 'auto';

                      if (fieldSchema?.type === 'boolean') {
                        minWidth = Math.max(headerTextWidth, 100);
                        maxWidth = '120px';
                      } else if (fieldSchema?.type === 'media') {
                        minWidth = Math.max(headerTextWidth, 100);
                        maxWidth = '120px';
                      } else if (fieldSchema?.type === 'date' || fieldSchema?.type === 'datetime') {
                        minWidth = Math.max(headerTextWidth, 160);
                        maxWidth = '180px';
                      } else if (fieldSchema?.type === 'integer' || fieldSchema?.type === 'biginteger') {
                        minWidth = Math.max(headerTextWidth, 100);
                        maxWidth = '150px';
                      } else {
                        minWidth = Math.max(headerTextWidth, 150);
                        maxWidth = '300px';
                      }

                      return (
                        <Th
                          key={field}
                          style={{
                            borderRight: '1px solid #dcdce4',
                            borderBottom: '2px solid #dcdce4',
                            backgroundColor: '#f6f6f9',
                            minWidth: `${minWidth}px`,
                            maxWidth: maxWidth,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <Typography variant="sigma" textColor="neutral600">
                            {field}
                          </Typography>
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {documents.map((doc) => {
                    const docId = doc.documentId || doc.id;
                    if (!docId) return null;

                    const editedDoc = editedEntries[docId] || doc;

                    return (
                      <Tr key={docId}>
                        <Td
                          style={{
                            borderRight: '1px solid #dcdce4',
                            borderBottom: '1px solid #dcdce4',
                            backgroundColor: '#fafafa',
                            fontWeight: 500,
                          }}
                        >
                          <Typography textColor="neutral800" variant="omega">
                            {String(docId).slice(0, 8)}...
                          </Typography>
                        </Td>
                        {fields.map((field) => {
                          const fieldSchema = getFieldType(field);
                          const isSelected = isInDragSelection(docId, field) || isCellSelected(docId, field);
                          const isMediaField = fieldSchema?.type === 'media';
                          const isHovered = hoveredCell?.docId === docId && hoveredCell?.field === field;

                          return (
                            <Td
                              key={field}
                              onClick={(e) => handleCellClick(e, docId, field)}
                              onMouseEnter={() => {
                                setHoveredCell({ docId, field });
                                if (!isMediaField) handleDragOver(docId, field);
                              }}
                              onMouseLeave={() => setHoveredCell(null)}
                              style={{
                                position: 'relative',
                                backgroundColor: isSelected ? '#e0f2ff' : 'white',
                                borderRight: '1px solid #dcdce4',
                                borderBottom: '1px solid #dcdce4',
                                padding: '4px',
                                userSelect: (dragStart || selectedCells.size > 0) ? 'none' : 'auto',
                                minHeight: '48px',
                                verticalAlign: 'middle',
                                cursor: 'default',
                              }}
                            >
                              <div style={{ position: 'relative' }}>
                                {renderFieldInput(docId, field, editedDoc[field], fieldSchema, populatingRelations)}

                                {/* Drag handle - only show on hover, not for media fields */}
                                {!isMediaField && isHovered && !populatingRelations && (
                                  <div
                                    onMouseDown={(e) => handleDragStart(e, docId, field)}
                                    onMouseUp={handleDragEnd}
                                    style={{
                                      position: 'absolute',
                                      bottom: '2px',
                                      right: '2px',
                                      width: '8px',
                                      height: '8px',
                                      backgroundColor: '#4945ff',
                                      cursor: 'crosshair',
                                      borderRadius: '1px',
                                    }}
                                  />
                                )}
                              </div>
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Box>
        </Modal.Body>

        <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          {schema?.options?.draftAndPublish ? (
            <>
              <Button
                onClick={() => handleSave(false)}
                variant="secondary"
                loading={saving}
                disabled={fields.length === 0 || populatingRelations}
              >
                Save All
              </Button>
              <Button
                onClick={() => handleSave(true)}
                loading={saving}
                disabled={fields.length === 0 || populatingRelations}
              >
                Publish All
              </Button>
            </>
          ) : (
            <Button onClick={() => handleSave(false)} loading={saving} disabled={fields.length === 0 || populatingRelations}>
              Save All Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>

    {/* Exit confirmation dialog */}
    {showExitConfirm && (
      <Modal.Root open onOpenChange={handleCancelExit}>
        <Modal.Content>
          <Modal.Header>
            <Typography fontWeight="bold" textColor="neutral800" as="h2">
              Unsaved Changes
            </Typography>
          </Modal.Header>
          <Modal.Body>
            <Typography>
              You have unsaved changes. Are you sure you want to exit without saving?
            </Typography>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCancelExit} variant="tertiary">
              Continue Editing
            </Button>
            <Button onClick={handleConfirmExit} variant="danger">
              Exit Without Saving
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    )}
    </>
  );
};
