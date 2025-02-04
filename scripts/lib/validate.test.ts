import test from 'node:test';
import assert from 'node:assert';
import { type DuplicateItem, findDuplicateItems } from './validate.ts';
import type { Dict } from '../../worddata/dict.d.ts';

test('no duplicates', async (t) => {
  const d: Dict = {
    path: 'testpath',
    title: 'testtitle',
    category: 'testcategory',
    slug: 'testslug',
    items: [
      {
        hinshi: '普通名詞',
        hiragana: 'はい',
        word: '杯',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'さかずき',
        word: '杯',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'はな',
        word: '花',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'はね',
        word: '羽',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'かんむり',
        word: '冠',
      },
    ],
  };

  const duplicates = findDuplicateItems([d]);
  assert.deepStrictEqual(duplicates, []);
});

test('partial duplicates', async (t) => {
  const d: Dict = {
    path: 'testpath',
    title: 'testtitle',
    category: 'testcategory',
    slug: 'testslug',
    items: [
      {
        hinshi: '普通名詞',
        hiragana: 'はい',
        word: '杯',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'はい',
        word: '杯',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'はな',
        word: '花',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'はね',
        word: '羽',
      },
      {
        hinshi: '普通名詞',
        hiragana: 'かんむり',
        word: '冠',
      },
    ],
  };

  const duplicates = findDuplicateItems([d]);

  const expected: DuplicateItem[][] = [
    [
      {
        path: d.path,
        hiragana: 'はい',
        word: '杯',
      },
      {
        path: d.path,
        hiragana: 'はい',
        word: '杯',
      },
    ],
  ];

  assert.deepStrictEqual(duplicates, expected);
});
