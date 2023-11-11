import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// diff出す
const gitRootCmd = 'git rev-parse --show-superproject-working-tree --show-toplevel';
const gitRoot = execSync(gitRootCmd).toString('utf8').trim();
const diffCmd = `git diff HEAD^ -- "${gitRoot}/genshin-dictionary/原神辞書_macOS.txt"`;
const diff = execSync(diffCmd).toString('utf8');
const diffLines = diff.split('\n');

// 追加分単語テーブルを作る
const added = diffLines.filter((d) => d.startsWith('+') && !d.startsWith('+++'));
const addedSplit = added.map((a) => a.slice(1).replace(/"/g, '').split(','));

let mdTable = '|単語|読み|\n|--|--|\n';
for (const [ruby, word, _] of addedSplit) {
  mdTable = mdTable + `|${word}|${ruby}|\n`;
}

// リリースノートを作る
const releaseNoteMd = `
[原神](https://genshin.hoyoverse.com/ja/home)の日本語入力用辞書です。
人名、地名、装備名などをカバーしています。

利用するには、下記のAssetsから \`genshin-dictionary.zip\` をダウンロードしてください。
詳しい使用方法については以下をご覧ください。

https://github.com/kotofurumiya/genshin-dict

## 今回の追加内容

<details>
<summary>クリックで表示</summary>

${mdTable}

</details>
`;

// ファイルに書き出す
const filePath = `${gitRoot}/RELEASE_NOTE_GENERATED.md`;
writeFileSync(filePath, releaseNoteMd, 'utf8');
