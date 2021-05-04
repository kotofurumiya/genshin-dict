import { DictItem } from '../../worddata/dict';
import dict from '../../worddata';

const createMdTable = (items: DictItem[]): string => {
  const head = '|単語|読み|品詞|';
  const sep = '|---|---|---|';
  const rows = items
    .map(({ hiragana, word, hinshi }) => {
      return `|${word}|${hiragana}|${hinshi}|`;
    })
    .join('\n');
  return [head, sep, rows].join('\n');
};

type DictMeta = {
  title: string;
  items: DictItem[];
};

type Page = {
  title: string;
  slug: string;
  content: string;
  total: number;
};

const createPage = (title: string, slug: string, data: DictMeta[]): Page => {
  const head = `# ${title}`;

  const sections = data
    .map(({ title, items }) => {
      return `## ${title}\n\n` + createMdTable(items);
    })
    .join('\n\n');

  const content = [head, sections].join('\n\n');
  const total = data.reduce((prev, curr) => prev + curr.items.length, 0);

  return {
    title,
    slug,
    content,
    total,
  };
};

const createIndexPage = (pages: Page[]): Page => {
  const head = '# 登録単語の一覧';

  const thead = '|カテゴリ|登録数|';
  const sep = '|---|--:|';
  const rows = pages
    .map(({ title, slug, total }) => {
      return `|[${title}](./${slug}.md)|${total}|`;
    })
    .join('\n');
  const table = [thead, sep, rows].join('\n');

  const content = [head, table].join('\n\n');

  return {
    title: '登録単語の一覧',
    slug: 'dict_data',
    content,
    total: 0,
  };
};

export const generateDocs = () => {
  const world: DictMeta[] = [{ title: 'テイワット', items: dict.world.teyvat }];

  const person: DictMeta[] = [
    { title: 'モンド', items: dict.person.mond },
    { title: '璃月', items: dict.person.riyue },
    { title: '稲妻', items: dict.person.inazuma },
    { title: 'スネージナヤ', items: dict.person.snezhnaya },
    { title: 'カーンルイア', items: dict.person.khaenriah },
  ];

  const place: DictMeta[] = [
    { title: 'モンド', items: dict.place.mond },
    { title: 'ドラゴンスパイン', items: dict.place.dragonspine },
    { title: '璃月', items: dict.place.riyue },
    { title: '稲妻', items: dict.place.inazuma },
    { title: 'スネージナヤ', items: dict.place.snezhnaya },
    { title: 'カーンルイア', items: dict.place.khaenriah },
    { title: 'その他', items: dict.place.khaenriah },
  ];

  const item: DictMeta[] = [
    { title: '武器', items: dict.item.weapon },
    { title: '食べ物', items: dict.item.food },
    { title: 'アイテム', items: dict.item.stuff },
  ];

  const pages = [
    createPage('ワールド', 'dict/world', world),
    createPage('人物', 'dict/person', person),
    createPage('場所', 'dict/place', place),
    createPage('もの', 'dict/item', item),
  ];

  const indexPage = createIndexPage(pages);

  return [indexPage, ...pages];
};
