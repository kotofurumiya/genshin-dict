import path from 'node:path';
import url from "node:url";
// @ts-ignore @types/nodeが更新されたらこのignoreは消す
import { globSync } from 'node:fs'
import { Dict, DictBase } from './dict';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const dictFilePathList = globSync(path.join(dirname, 'data', '**/*.ts'));

export const loadDictList = async() => {
  const dictList: Dict[] = [];
  for(const dictPath of dictFilePathList) {
    const dict: DictBase = (await import(dictPath)).default;
    const items = dict.items.map((item) => ({...item, hinshi: dict.hinshi}));
    const filePath = `dict/${path.dirname(dictPath).split('/').at(-1)}/${path.basename(dictPath, '.ts')}`;
  
    dictList.push({
      category: dict.category,
      title: dict.title,
      slug: filePath,
      items,
    });
  }
  return dictList;
};