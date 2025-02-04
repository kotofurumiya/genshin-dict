import type { Dict } from '../../worddata/dict';
import { type YomiganaValidateResult, validateYomigana } from './japanese.ts';

// Dict内の各項目についてのvalidation結果を返す。
export const validateDictItemsYomigana = (dict: Dict): YomiganaValidateResult[] => {
  const results = dict.items.map((i) => validateYomigana(i.hiragana));
  return results;
};

export type DuplicateItem = {
  path: string;
  hiragana: string;
  word: string;
};

// 重複項目があればfalse、そうでなければtrue。
// 重複の定義は、読みと単語の両方が一致する項目が複数存在すること。
// 例：
//   [{hiragana:'はい', word:'杯'}, {hiragana:'さかずき', word: '杯'}] → false
//   [{hiragana:'はい', word:'杯'}, {hiragana:'はい', word: '杯'}] → true
export const findDuplicateItems = (dicts: Dict[]): DuplicateItem[][] => {
  // 読みと単語の組を放り込んでいって重複チェック
  const m: Record<string, DuplicateItem[] | undefined> = {};

  // 与えられた全辞書横断で調べる。
  for (const d of dicts) {
    for (const i of d.items) {
      const key = `${i.hiragana}##${i.word}`;
      const itm = {
        path: d.path,
        hiragana: i.hiragana,
        word: i.word,
      };

      // キーにヒットしないときは登場初回なので配列を追加して次のループにcontinue。
      if (!m[key]) {
        m[key] = [itm];
        continue;
      }

      // キーにヒットした（配列が存在する）場合は2回目以降の登場なので配列に追加する。
      if (m[key]) {
        m[key].push(itm);
      }
    }
  }

  // 配列長が2以上のものが重複なので抽出する。
  const duplicates = Object.values(m).filter((d): d is DuplicateItem[] => !!d && d?.length > 1);
  return duplicates;
};
