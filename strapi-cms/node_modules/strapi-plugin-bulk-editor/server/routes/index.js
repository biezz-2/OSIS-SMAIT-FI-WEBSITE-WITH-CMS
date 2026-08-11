export default [
  {
    method: 'POST',
    path: '/bulk-update',
    handler: 'bulk-editor.bulkUpdate',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/get-populated',
    handler: 'bulk-editor.getPopulated',
    config: {
      policies: [],
      auth: false,
    },
  },
];
