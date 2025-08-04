import type { DictBase } from '../../dict.d.ts';

export default {
  category: 'ワールド',
  title: '七聖召喚',
  hinshi: '普通名詞',
  items: [
    // カード種別
    { hiragana: 'きゃらかーど', word: 'キャラカード' },
    { hiragana: 'あくしょんかーど', word: 'アクションカード' },
    { hiragana: 'そうびかーど', word: '装備カード' },
    { hiragana: 'しえんかーど', word: '支援カード' },
    { hiragana: 'いべんとかーど', word: 'イベントカード' },

    // フェーズ
    { hiragana: 'ろーるふぇーず', word: 'ロールフェーズ' },
    { hiragana: 'あくしょんふぇーず', word: 'アクションフェーズ' },
    { hiragana: 'えんどふぇーず', word: 'エンドフェーズ' },

    // 元素
    { hiragana: 'げんそさいころ', word: '元素サイコロ' },
    { hiragana: 'りろーる', word: 'リロール' },
    { hiragana: 'ばんのうげんそ', word: '万能元素' },
    { hiragana: 'げんそちょうわ', word: '元素調和' },
    { hiragana: 'どういつげんそ', word: '同一元素' },
    { hiragana: 'むしょくげんそ', word: '無色元素' },

    // アクション
    { hiragana: 'せんとうあくしょん', word: '戦闘アクション' },
    { hiragana: 'くいっくあくしょん', word: 'クイックアクション' },

    // エリア
    { hiragana: 'きゃらえりあ', word: 'キャラエリア' },
    { hiragana: 'きゃらふぞく', word: 'キャラ付属' },
    { hiragana: 'しえんえりあ', word: '支援エリア' },
    { hiragana: 'しょうかんぶつえりあ', word: '召喚物エリア' },
  ]
} as DictBase;