# upath2 - 跨平台路徑處理工具

![](https://david-dm.org/bluelovers/node-upath2.svg)

> 一個 `path` 的代理，將所有結果中的反斜線 (`\`) 替換為正斜線 (`/`)，從而實現跨平台的路徑處理。

## 主要功能

- 跨平台路徑處理
- 自動替換反斜線為正斜線
- 完全相容於 Node.js path 模組
- 支援 Windows 和 POSIX 平台
- 內建網路磁碟機路徑處理

## 安裝

```bash
npm install upath2
```

## 快速開始

## 使用方式

### 匯入模組

```ts
import * as upath from 'upath2';
```

### 基本使用

```ts
// 原來使用 path
import * as path from 'path';

// 改用 upath2
import * as upath from 'upath2';
```

upath2 完全相容於 Node.js path 模組的 API，可以無縫替換。

### 跨平台路徑處理

```ts
// Windows 路徑
const winPath = upath.join('C:\\Users\\User\\Documents', 'file.txt');
console.log(winPath); // 'C:/Users/User/Documents/file.txt'

// POSIX 路徑
const posixPath = upath.join('/home/user', 'documents', 'file.txt');
console.log(posixPath); // '/home/user/documents/file.txt'
```

