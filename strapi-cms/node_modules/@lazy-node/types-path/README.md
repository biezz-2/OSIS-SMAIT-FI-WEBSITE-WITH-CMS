# @lazy-node/types-path - 路徑處理類型定義模組

這個模組提供了完整的路徑處理相關類型定義，支援多種平台和路徑處理庫。

## 主要功能

- 完整的路徑處理類型定義
- 支援多種平台（Windows、POSIX）
- 支援多種路徑處理庫（Node.js、upath2）
- 靈活的路徑處理介面
- 路徑分隔符合規表示式工具
- TypeScript 友好的類型支援

## 安裝

```bash
yarn add @lazy-node/types-path
yarn-tool add @lazy-node/types-path
yt add @lazy-node/types-path
```

## 快速開始

```typescript
import { IPath, EnumPathPlatformOrigin, makeRePathSepSlash } from '@lazy-node/types-path';

// 使用路徑處理介面
const pathHandler: IPath = {
  name: EnumPathPlatformOrigin.posix,
  join: (path, ...paths) => path + '/' + paths.join('/'),
  normalize: (path) => path.replace(/\\/g, '/'),
  // ... 其他方法
};

// 建立路徑分隔符合規表示式
const reSlash = makeRePathSepSlash({ global: true });
const reWin32 = makeRePathSepSlash({ sep: '\\', global: true });

console.log('/path/to/file'.replace(reSlash, '\\')); // 轉換為 Windows 路徑
```

## API 文件

### 基本類型

#### IPlatformPathNodeOrigin
Node.js 原生 path 模組的類型定義。

#### IPathPlatformOrigin
平台特定的路徑類型，支援 'win32' 和 'posix'。

#### IPathPlatform
完整的路徑平台類型，包含原生和擴展平台類型。

#### IPathSep
平台特定的檔案分隔符類型。

#### IPathDelimiter
平台特定的路徑分隔符類型。

### 介面定義

#### IPathNode
Node.js 原生 path 模組介面，包含核心路徑處理方法。

#### IPath
擴展路徑處理介面，提供更靈活的路徑處理功能。

### 工具函數

#### makeRePathSepSlash(options?: IRePathSepSlashOptions): RegExp
建立路徑分隔符合規表示式。

**參數：**
- `options` (IRePathSepSlashOptions): 選項物件

**返回值：**
- `RegExp`: 正規表示式

**選項物件：**
```typescript
interface IRePathSepSlashOptions {
  sep?: IPathSep;        // 指定分隔符
  all?: boolean;         // 是否匹配所有分隔符
  global?: boolean;      // 是否全域匹配
  match?: boolean;       // 是否使用捕獲群組
  matchFull?: boolean;   // 是否完整匹配
  repeat?: number;       // 重複次數
}
```

## 使用範例

### 基本類型使用

```typescript
import { EnumPathPlatformOrigin, IPathPlatform } from '@lazy-node/types-path';

// 使用平台列舉
const platform: IPathPlatform = EnumPathPlatformOrigin.win32;

// 檢查平台類型
if (platform === EnumPathPlatformOrigin.posix) {
  console.log('POSIX 平台');
}
```

### 路徑處理介面

```typescript
import { IPath, EnumPathPlatformOrigin } from '@lazy-node/types-path';

// 實作自定義路徑處理器
const customPathHandler: IPath = {
  name: EnumPathPlatformOrigin.posix,
  join: (path, ...paths) => {
    return [path, ...paths].join('/').replace(/\/+/g, '/');
  },
  normalize: (path) => {
    return path.replace(/\\/g, '/').replace(/\/+$/, '');
  },
  // ... 實作其他方法
};
```

### 正規表示式工具

```typescript
import { makeRePathSepSlash, EnumPathSep } from '@lazy-node/types-path';

// 建立全域路徑分隔符合規表示式
const reAll = makeRePathSepSlash({ global: true });
console.log('/path\\to/file'.replace(reAll, '/')); // '/path/to/file'

// 建立 Windows 專用正規表示式
const reWin32 = makeRePathSepSlash({ 
  sep: EnumPathSep.win32, 
  global: true 
});
console.log('C:\\path\\to\\file'.replace(reWin32, '/')); // 'C:/path/to/file'

// 建立完整匹配正規表示式
const reFull = makeRePathSepSlash({ matchFull: true });
console.log(reFull.test('/path/to/file')); // true
```

### 實際應用場景

```typescript
import { IPath, makeRePathSepSlash } from '@lazy-node/types-path';

// 跨平台路徑處理工具
class CrossPlatformPath {
  private pathHandler: IPath;

  constructor(platform: 'win32' | 'posix') {
    this.pathHandler = this.createPathHandler(platform);
  }

  private createPathHandler(platform: 'win32' | 'posix'): IPath {
    const sep = platform === 'win32' ? '\\' : '/';
    
    return {
      name: platform,
      join: (path, ...paths) => {
        return [path, ...paths].join(sep).replace(new RegExp(`${sep}+`, 'g'), sep);
      },
      normalize: (path) => {
        const re = makeRePathSepSlash({ global: true });
        return path.replace(re, sep).replace(new RegExp(`${sep}+$`), '');
      },
      // ... 其他方法
    };
  }

  join(...paths: string[]): string {
    return this.pathHandler.join(...paths);
  }

  normalize(path: string): string {
    return this.pathHandler.normalize(path);
  }
}

// 使用範例
const win32Path = new CrossPlatformPath('win32');
console.log(win32Path.join('C:', 'Users', 'name', 'Documents')); // 'C:\Users\name\Documents'

const posixPath = new CrossPlatformPath('posix');
console.log(posixPath.join('/home', 'user', 'documents')); // '/home/user/documents'
```

## 貢獻

歡迎提交問題和拉取請求！

## 授權

ISC

