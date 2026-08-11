export default {
  // Fetch documents with all relations populated
  async getPopulated(ctx) {
    const { contentType, documentIds } = ctx.request.body;

    if (!contentType || !documentIds || !Array.isArray(documentIds)) {
      return ctx.badRequest('Missing or invalid contentType or documentIds');
    }

    try {
      const results = [];

      for (const docId of documentIds) {
        try {
          const doc = await strapi.documents(contentType).findOne({
            documentId: docId,
            populate: '*',
          });

          if (doc) {
            results.push(doc);
          }
        } catch (error) {
          console.error(`[BULK-EDITOR] Failed to fetch ${docId}:`, error.message);
        }
      }

      return ctx.send({
        success: true,
        documents: results,
      });
    } catch (error) {
      console.error('[BULK-EDITOR] Fatal error:', error);
      return ctx.internalServerError('Failed to fetch documents', { error: error.message });
    }
  },

  async bulkUpdate(ctx) {
    const { contentType, updates, publish } = ctx.request.body;

    if (!contentType || !updates || !Array.isArray(updates)) {
      return ctx.badRequest('Missing or invalid contentType or updates');
    }

    try {
      const results = [];

      // Get the content type schema to identify relation fields
      const contentTypeSchema = strapi.contentType(contentType);
      const relationFields = Object.entries(contentTypeSchema.attributes || {})
        .filter(([_, attr]) => attr.type === 'relation')
        .map(([name, attr]) => ({ name, relation: attr.relation, mappedBy: attr.mappedBy, inversedBy: attr.inversedBy }));

      // Collect mappedBy fields that need to be updated from the owning side
      const mappedByUpdates = new Map();

      // Process each update
      for (const update of updates) {
        const { id, data } = update;

        if (!id || !data) {
          results.push({ id, success: false, error: 'Missing id or data' });
          continue;
        }

        // Transform relation fields to use Strapi v5's connect/disconnect/set syntax
        const transformedData = { ...data };

        relationFields.forEach(({ name, relation, mappedBy }) => {
          if (name in transformedData) {
            const value = transformedData[name];
            const fieldAttr = contentTypeSchema.attributes[name];
            const isManyRelation = relation.includes('ToMany') || relation === 'manyToMany';

            // mappedBy fields are READ-ONLY - must update from owning side
            if (mappedBy) {
              const targetContentType = fieldAttr.target;

              // Remove from this update - we'll handle it separately
              delete transformedData[name];

              // Schedule update on the owning side (target content type)
              if (value !== null && value !== undefined && value !== '') {
                if (!mappedByUpdates.has(targetContentType)) {
                  mappedByUpdates.set(targetContentType, new Map());
                }
                const targetUpdates = mappedByUpdates.get(targetContentType);
                const targetDocId = String(value);

                if (!targetUpdates.has(targetDocId)) {
                  targetUpdates.set(targetDocId, []);
                }
                targetUpdates.get(targetDocId).push({ field: mappedBy, targetDocId: id });
              }
              return;
            }

            // For owning side relations, use { set: [...] }
            if (isManyRelation) {
              const ids = Array.isArray(value) ? value : [];
              transformedData[name] = { set: ids };
            } else {
              if (value === null || value === undefined || value === '') {
                transformedData[name] = { set: [] };
              } else {
                transformedData[name] = { set: [value] };
              }
            }
          }
        });

        try {
          const updateOptions = {
            documentId: id,
            data: transformedData,
            populate: '*',
          };

          if (publish !== undefined) {
            updateOptions.status = publish ? 'published' : 'draft';
          }

          const updated = await strapi.documents(contentType).update(updateOptions);
          results.push({ id, success: true, data: updated });
        } catch (error) {
          console.error(`[BULK-EDITOR] Update failed for ${id}:`, error.message);
          results.push({ id, success: false, error: error.message });
        }
      }

      // Update mappedBy relations from the owning side
      if (mappedByUpdates.size > 0) {
        for (const [targetContentType, targetUpdates] of mappedByUpdates.entries()) {
          for (const [targetDocId, updates] of targetUpdates.entries()) {
            // Group updates by field name to accumulate all IDs
            const fieldToIds = new Map();
            for (const { field, targetDocId: galleryId } of updates) {
              if (!fieldToIds.has(field)) {
                fieldToIds.set(field, []);
              }
              fieldToIds.get(field).push(galleryId);
            }

            // Build update data with all accumulated IDs per field
            const updateData = {};
            for (const [field, galleryIds] of fieldToIds.entries()) {
              updateData[field] = { set: galleryIds };
            }

            try {
              await strapi.documents(targetContentType).update({
                documentId: targetDocId,
                data: updateData,
              });
            } catch (error) {
              console.error(`[BULK-EDITOR] Failed to update ${targetContentType}/${targetDocId}:`, error.message);
            }
          }
        }
      }

      return ctx.send({
        success: true,
        results,
      });
    } catch (error) {
      console.error('[BULK-EDITOR] Fatal error:', error);
      return ctx.internalServerError('Bulk update failed', { error: error.message });
    }
  },
};
