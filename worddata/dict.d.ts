export type KotoeriHinshi = 
  '普通名詞' |
  'サ変名詞' |
  '人名' |
  '地名' | 
  '形容詞' |
  '副詞';

export type WindowsImeHinshi =
  '名詞' |
  'さ変名詞' |
  '人名' |
  '地名その他' |
  '形容詞' |
  '副詞';

export type DictItem = {
  hiragana: string;
  word: string;
  hinshi: KotoeriHinshi;
  note?: string;
};

export type PartialDictItem = Omit<DictItem, 'hinshi'>;

export type DictBase = {
  category: string;
  title: string;
  hinshi: KotoeriHinshi;
  items: PartialDictItem[];
}

export type Dict = {
  path: string;
  category: string;
  title: string;
  slug: string;
  items: DictItem[];
}