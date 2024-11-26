import { DictItem, KotoeriHinshi, WindowsImeHinshi } from '../../worddata/dict';

export const expandVuHiragana = (items: DictItem[]) => {
  // "ゔ"が入力できず"ヴ"になるIMEがあるので
  // "ゔ"を"ヴ"を置き換えたものを追加する
  return items.flatMap((i) => {
    if (i.hiragana.includes('ゔ')) {
      const replaced = { ...i };
      replaced.hiragana = replaced.hiragana.replaceAll('ゔ', 'ヴ');
      return [i, replaced];
    }

    return [i];
  });
};

export const toMacUserDict = (items: DictItem[]) => {
  const head = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>`;

  const dicts = items
    .map(({ hiragana, word }) => {
      return `<dict>
  <key>phrase</key>
  <string>${word}</string>
  <key>shortcut</key>
  <string>${hiragana}</string>
</dict>`;
    })
    .join('\n');

  const foot = `</array>
</plist>`;

  return [head, dicts, foot].join('\n');
};

export const toKotoeriDict = (items: DictItem[]) => {
  return items.map((item) => `"${item.hiragana}","${item.word}","${item.hinshi}"`).join('\n');
};

export const toWindowsImeDict = (items: DictItem[]) => {
  const hinshiConv = (hinshi: KotoeriHinshi): WindowsImeHinshi => {
    if (hinshi === '普通名詞') {
      return '名詞';
    } else if (hinshi === 'サ変名詞') {
      return 'さ変名詞';
    } else if (hinshi === '地名') {
      return '地名その他';
    }

    return hinshi;
  };

  return items
    .map(({ hinshi, ...item }) => ({
      ...item,
      hinshi: hinshiConv(hinshi),
    }))
    .map((item) => `${item.hiragana}\t${item.word}\t${item.hinshi}`)
    .join('\r\n');
};

// WindowsではBOMつきUTF-16を使う場合があるので、その変換関数。
export const toUtf16BOM = (str: string): Buffer => {
  // BOMを手動で付与するだけでok。
  const u16leBuf = Buffer.from(`\ufeff${str}`, 'utf16le');
  return u16leBuf;
};

export const toSkkDict = (items: DictItem[]) => {
  const head = `;; -*- fundamental -*- ; coding: utf-8 -*-
;; okuri-ari entries.
;; okuri-nasi entries.`;
  const dicts = items
    .map(({ hiragana, word }) => {
      return `${hiragana} /${word}/`;
    })
    .join('\n');
  return [head, dicts].join('\n');
};
