# Cursor Rules（テンプレート同梱）

| ファイル | 種別 |
|----------|------|
| `web-coding-common.mdc` | 共通（常時） |
| `web-coding-html.mdc` | HTML / a11y（`**/*.html`） |
| `web-coding-scss.mdc` | SCSS（`**/*.scss`） |
| `project.mdc` | 案件固有（編集する） |

新規案件: `project.mdc` を案件内容に合わせて更新。`_template/project.mdc.example` を参照。

**ワークスペースは案件フォルダ（例: `sample-test`）を開く**とルールが有効になります。

## JS 運用

- 開発: `script.js` で使う part の import コメントを外す
- 納品: 未使用の import 行と `parts/_*.js` を手動削除してから `npx gulp build`
