const hiraganas = [
  ...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもらりるれろやゐゆゑよわをんぁぃぅぇぉゃゅょっ'.split(
    ''
  ),
  ...'がぎぐげござじずぜぞだぢづでどばびぶべぼゔ'.split(''),
  ...'ぱぴぷぺぽ',
];

const katakanas = [
  ...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモラリルレロヤヰユヱヨワヲンァィゥェォャュョッ'.split(
    ''
  ),
  ...'ガギッゲゴザジズゼゾダヂヅデドバビブベボヴ'.split(''),
  ...'パピプペポ'.split(''),
];

const symbols = '・ー'.split('');

// 文字 → booleanのマップを作る。
// 使用可能文字のチェックに使用する。
const createMatchMap = (chars: string[]): Record<string, boolean | undefined> => {
  const t: Record<string, boolean | undefined> = {};

  for (const c of chars) {
    t[c] = true;
  }

  return t;
};

export type YomiganaValidateResult = {
  ok: boolean;
  text: string;
  invalidCharacters: string[];
};

const validYomiganaMap = createMatchMap([...hiraganas, ...symbols]);

export const validateYomigana = (yomigana: string): YomiganaValidateResult => {
  const result: YomiganaValidateResult = {
    ok: true,
    text: yomigana,
    invalidCharacters: [],
  };
  const chars = yomigana.split('');

  // invalidな文字を追加していく
  for (const c of chars) {
    if (!validYomiganaMap[c]) {
      result.ok = false;
      result.invalidCharacters.push(c);
    }
  }

  return result;
};
