<div align="center">
  <img style="width: 160px; height: auto;" src="https://i.imgur.com/z0LMq7J.png" alt="Logo for Strapi Plugin: Bulk Editor" />

  <h1>Strapi Plugin: Bulk Editor</h1>

<a href="https://strapi.io/five"><img src="https://img.shields.io/badge/Strapi-v5-blue" alt="Strapi v5" /></a>
<a href="https://www.npmjs.com/package/strapi-plugin-bulk-editor"><img src="https://img.shields.io/npm/v/strapi-plugin-bulk-editor" alt="npm" /></a>

  <p>Edit multiple Strapi entries at once in a spreadsheet-like interface.</p>

  <img style="width: 960px; height: auto;" src="https://i.imgur.com/ah3PnvA.png" alt="A screenshot of the Strapi dashboad with a spreadsheet-like bulk editor modal opened" />
</div>

<h1>Get Started</h1>

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Supported Field Types](#supported-field-types)
- [Troubleshooting](#troubleshooting)
  - [ESM/CommonJS Module Errors](#esmcommonjs-module-errors)
  - [Peer Dependency Conflicts](#peer-dependency-conflicts)
  - ["Bulk Edit" Button Not Appearing](#bulk-edit-button-not-appearing)
- [License](#license)

## Features

- **Spreadsheet View** - Edit multiple entries in a familiar table layout
- **Multi-Cell Selection** - Select and edit multiple cells at once
  - Click to select a cell
  - Cmd/Ctrl+Click to toggle additional cells (same column only)
  - Shift+Click for range selection
  - Shift+Cmd/Ctrl+Click to add a new range selection to the current selection
- **Drag to Fill** - Drag a value down to apply it to multiple rows
- **Bulk Save** - Save all changes in a single operation
- **Almost All Field Types** - Text, numbers, booleans, enums, dates, and relations… Support list below
- **Relation Support** - Full support for oneToOne, manyToOne, oneToMany, and manyToMany relations

## Requirements

- Strapi v5.0.0 or higher

## Installation

```bash
npm install strapi-plugin-bulk-editor
```

Add the plugin to your Strapi config:

```js
// config/plugins.js or config/plugins.ts
module.exports = {
  ...
  "bulk-editor": {
    enabled: true,
  },
};
```

Start your Strapi admin panel :

```bash
npm run develop
```

## Usage

1. Navigate to any content type in the Content Manager
2. Select at least one entry using the checkboxes
3. Click the **"Bulk Edit"** button in the action bar
4. Edit fields directly in the spreadsheet view
5. Click **Save** to apply all changes

> ⚠️ **Warning** : This plugin is still in beta (v0.1). It may overwrite data inadvertently. Always check before saving. When in doubt, discard the edit.

## Supported Field Types

| Type                      | Support            |
| ------------------------- | ------------------ |
| String / Text             | ✅ Full            |
| Integer / Float / Decimal | ✅ Full            |
| Boolean                   | ✅ Full            |
| Enumeration               | ✅ Full (dropdown) |
| Date / DateTime / Time    | ✅ Full            |
| Email / Password          | ✅ Full            |
| Relation (all types)      | ✅ Full            |
| JSON                      | 👁️ Read-only       |
| Rich Text / Blocks        | 👁️ Read-only       |
| Media                     | 👁️ Read-only       |
| Components                | ❌ Not supported   |
| Dynamic Zones             | ❌ Not supported   |

## Troubleshooting

### ESM/CommonJS Module Errors

If you encounter errors like:
```
The requested module '/admin/node_modules/react-dom/index.js' does not provide an export named 'flushSync'
```
or similar errors with `lodash`, you need to configure Vite's dependency optimization.

**Fix:** Update your Strapi admin Vite config:

```ts
// src/admin/vite.config.ts
import { mergeConfig, type UserConfig } from "vite";

export default (config: UserConfig) => {
  return mergeConfig(config, {
    optimizeDeps: {
      include: ['react-dom', 'lodash'],
    },
  });
};
```

If you don't have this file, create it. Then clear the Vite cache and restart:

```bash
rm -rf node_modules/.vite
npm run develop
```

### Peer Dependency Conflicts

If you get peer dependency errors during installation, use the `--legacy-peer-deps` flag:

```bash
npm install strapi-plugin-bulk-editor --legacy-peer-deps
```

### "Bulk Edit" Button Not Appearing

Make sure the plugin is enabled in your config:

```js
// config/plugins.js or config/plugins.ts
module.exports = {
  "bulk-editor": {
    enabled: true,
  },
};
```

Then rebuild and restart Strapi:

```bash
rm -rf .cache dist node_modules/.vite
npm run build
npm run develop
```

## License

MIT
