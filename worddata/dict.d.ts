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
};

export type PartialDictItem = Omit<DictItem, 'hinshi'>;