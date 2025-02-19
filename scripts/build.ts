import fs from 'fs';
import url from 'url';
import path from 'path';
import { loadDictList } from '../worddata/index.js';
import { toKotoeriDict, toMacUserDict, toWindowsImeDict, expandVuHiragana, toUtf16BOM } from './lib/platform.js';
import { generateDocs } from './lib/docgen.js';
import { DictItem } from '../worddata/dict.js';
import { findDuplicateItems, validateDictItemsYomigana } from './lib/validate.js';

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

  // よみがなに使用できない文字が含まれていないかチェックする。
  let includesInvalid = false;
  for (const d of dictList) {
    const results = validateDictItemsYomigana(d);
    const invalids = results.filter((r) => !r.ok);

    if (invalids.length > 0) {
      includesInvalid = true;
      const errors = invalids.map(
        (e) => `  "${e.text}" includes invalid characters "${e.invalidCharacters.join(',')}"`
      );

      console.error(`${d.path}`);
      console.error(errors.join('\n'));
    }
  }

  // よみがなに使用できない文字があったらエラー終了する。
  if (includesInvalid) {
    process.exit(1);
  }

  // 重複項目チェック。読み仮名と単語の両方が同一のものが複数あったら抽出する。
  const duplicates = findDuplicateItems(dictList);

  if (duplicates.length > 0) {
    console.error(`Duplicated words:`);
    for (const d of duplicates) {
      const f = d.at(0);
      if (!f) {
        continue;
      }

      console.error(`${f.hiragana}, ${f.word}`);
      console.error(d.map((i) => `  ${i.path}`).join('\n'));
    }
    process.exit(1);
  }

  // 五十音順にソートする＆「ゔ」を扱えないIMEのために「ヴ」に変換する
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

  fs.writeFileSync(winDictFile, toUtf16BOM(winIme));
  fs.writeFileSync(macDictFile, kotoeri, 'utf8');
  fs.writeFileSync(macUserDictFile, plist, 'utf8');

  console.log('完了しました');
  console.log(winDictFile);
  console.log(macDictFile);
  console.log(macUserDictFile);
})();
