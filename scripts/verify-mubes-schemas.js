const assert = require('assert');

// 1. Audit Log Content-Type Schema Validation
const auditLogSchema = require('../strapi-cms/src/api/audit-log/content-types/audit-log/schema.json');
assert.strictEqual(auditLogSchema.kind, 'collectionType');
assert.strictEqual(auditLogSchema.options.draftAndPublish, false);
assert.ok(auditLogSchema.attributes.content_type, 'content_type must exist in audit-log');
assert.ok(auditLogSchema.attributes.document_id, 'document_id must exist in audit-log');
assert.ok(auditLogSchema.attributes.action, 'action must exist in audit-log');
assert.deepStrictEqual(
  auditLogSchema.attributes.action.enum,
  ['create', 'update', 'delete', 'publish', 'unpublish']
);

// 2. Akses User Schema & Lifecycles Validation
const aksesUserSchema = require('../strapi-cms/src/api/akses-user/content-types/akses-user/schema.json');
assert.strictEqual(aksesUserSchema.kind, 'collectionType');
assert.strictEqual(aksesUserSchema.attributes.clerk_user_id.unique, true);
assert.strictEqual(aksesUserSchema.attributes.clerk_user_id.required, true);
assert.strictEqual(aksesUserSchema.attributes.status.default, 'pending');

// 3. Mubes LPJ Schema Validation
const mubesLpjSchema = require('../strapi-cms/src/api/mubes-lpj/content-types/mubes-lpj/schema.json');
assert.strictEqual(mubesLpjSchema.kind, 'collectionType');
assert.strictEqual(mubesLpjSchema.attributes.program_kerja.target, 'api::program-kerja.program-kerja');
assert.strictEqual(mubesLpjSchema.attributes.realisasi_anggaran.type, 'decimal');

// 4. Mubes Sidang Schema Validation
const mubesSidangSchema = require('../strapi-cms/src/api/mubes-sidang/content-types/mubes-sidang/schema.json');
assert.strictEqual(mubesSidangSchema.kind, 'collectionType');
assert.strictEqual(mubesSidangSchema.attributes.tahun_periode.required, true);

// 5. Login Event Schema Validation
const loginEventSchema = require('../strapi-cms/src/api/login-event/content-types/login-event/schema.json');
assert.strictEqual(loginEventSchema.kind, 'collectionType');
assert.strictEqual(loginEventSchema.attributes.identifier.required, true);

console.log('ALL SCHEMA CHECKS PASSED SUCCESSFULLY.');
