import { Dict, DictItem } from '../../worddata/dict';

const createMdTable = (items: DictItem[]): string => {
  const head = '|単語|読み|品詞|備考|';
  const sep = '|---|---|---|---|';
  const rows = items
    .map(({ hiragana, word, hinshi, note }) => {
      return `|${word}|${hiragana}|${hinshi}|${note || ''}|`;
    })
    .join('\n');
  return [head, sep, rows].join('\n');
};

type Page = {
  category: string;
  title: string;
  slug: string;
  content: string;
  total: number;
};

const createPage = (dict: Dict): Page => {
  const head = `# ${dict.category} / ${dict.title}`;

  const section = `## 単語\n\n` + createMdTable(dict.items);
  const content = [head, section].join('\n\n');
  const total = dict.items.length;

  return {
    category: dict.category,
    title: dict.title,
    slug: dict.slug,
    content,
    total,
  };
};

const createIndexPage = (pages: Page[]): Page => {
  const head = '# 登録単語の一覧';

  const thead = '|カテゴリ|登録数|';
  const sep = '|---|--:|';
  const rows = pages
    .map(({ category, title, slug, total }) => {
      return `|[${category}/${title}](./${slug}.md)|${total}|`;
    })
    .join('\n');
  const table = [thead, sep, rows].join('\n');

  const content = [head, table].join('\n\n');

  return {
    category: 'index',
    title: '登録単語の一覧',
    slug: 'dict_data',
    content,
    total: 0,
  };
};

export const generateDocs = (dictList: Dict[]) => {
  const pages = dictList.map((d) => createPage(d));
  const indexPage = createIndexPage(pages);

  return [indexPage, ...pages];
};
