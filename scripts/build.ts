import fs from 'fs';
import url from 'url';
import path from 'path';
import iconv from 'iconv-lite';
import { loadDictList } from '../worddata/index.js';
import { toKotoeriDict, toMacUserDict, toWindowsImeDict, expandVuHiragana } from './lib/platform.js';
import { generateDocs } from './lib/docgen.js';
import { DictItem } from '../worddata/dict.js';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const docDir = path.join(dirname, '..', 'docs');
const distDir = path.join(dirname, '..', 'genshin-dictionary');
const winDictFile = path.join(distDir, '原神辞書_Windows.txt');
const macDictFile = path.join(distDir, '原神辞書_macOS.txt');
const macUserDictFile = path.join(distDir, '原神辞書_macOS_ユーザ辞書.plist');

console.log('辞書データを構築しています...');

(async function main() {
  const dictList = await loadDictList();
  const words = expandVuHiragana(
    dictList
      .reduce<DictItem[]>((prev, curr) => [...prev, ...curr.items], [])
      .sort((a, b) => a.hiragana.localeCompare(b.hiragana, 'ja'))
  );

  const winIme = toWindowsImeDict(words);
  const kotoeri = toKotoeriDict(words);
  const plist = toMacUserDict(words);

  console.log('ドキュメントを生成しています...');

  const docs = generateDocs(dictList);

  for (const doc of docs) {
    const filePath = path.join(docDir, doc.slug + '.md');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
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
})();
