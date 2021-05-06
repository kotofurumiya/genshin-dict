import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import dict from '../worddata';
import { toKotoeriDict, toMacUserDict, toWindowsImeDict } from './lib/platform';
import { generateDocs } from './lib/docgen';

const docDir = path.join(__dirname, '..', 'docs');
const distDir = path.join(__dirname, '..', 'genshin-dictionary');
const winDictFile = path.join(distDir, '原神辞書_Windows.txt');
const macDictFile = path.join(distDir, '原神辞書_macOS.txt');
const macUserDictFile = path.join(distDir, '原神辞書_macOS_ユーザ辞書.plist');

console.log('辞書データを構築しています...');

const winIme = toWindowsImeDict(dict.all);
const kotoeri = toKotoeriDict(dict.all);
const plist = toMacUserDict(dict.all);

console.log('ドキュメントを生成しています...');

const docs = generateDocs();

for (const doc of docs) {
  const filePath = path.join(docDir, doc.slug + '.md');
  fs.writeFileSync(filePath, doc.content, 'utf8');
}

console.log('ファイルに書き出しています...');

fs.writeFileSync(winDictFile, iconv.encode(winIme, 'utf16'));
fs.writeFileSync(macDictFile, kotoeri, 'utf8');
fs.writeFileSync(macUserDictFile, plist, 'utf8');

console.log('完了しました');
console.log(winDictFile);
console.log(macDictFile);
console.log(macUserDictFile);
