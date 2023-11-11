import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// gitプロジェクトのルートディレクトリを見つける
const gitRootCmd = 'git rev-parse --show-superproject-working-tree --show-toplevel';
const gitRoot = execSync(gitRootCmd).toString('utf8').trim();

// 最新のtagとひとつ前のtagを見つける
const gitLatestTagsCmd = `git tag -l --sort -authordate | head -n2`;
const gitLatestTags = execSync(gitLatestTagsCmd).toString('utf8').split('\n');
const prevTag = gitLatestTags.at(1);
const currentTag = gitLatestTags.at(0);

// 前のtagから今のtagまでのdiffを取る
const diffCmd = `git diff ${prevTag}..${currentTag} -- "${gitRoot}/genshin-dictionary/原神辞書_macOS.txt"`;
const diff = execSync(diffCmd).toString('utf8');
const diffLines = diff.split('\n');

// diffから追加単語テーブルを作る
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
