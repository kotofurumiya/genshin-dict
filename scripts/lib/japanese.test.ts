import test from 'node:test';
import assert from 'node:assert';
import { validateYomigana } from './japanese.ts';

test('valid yomigana', async (t) => {
  assert.deepStrictEqual(validateYomigana('ぐーしぃ・とーすゔぃまらむらぱねーす'), {
    ok: true,
    text: 'ぐーしぃ・とーすゔぃまらむらぱねーす',
    invalidCharacters: [],
  });
});

test('invalid yomigana', async (t) => {
  assert.deepStrictEqual(validateYomigana('グーシィ・トースヴィマラ村パネース'), {
    ok: false,
    text: 'グーシィ・トースヴィマラ村パネース',
    invalidCharacters: 'グシィトスヴィマラ村パネス'.split(''),
  });
});
