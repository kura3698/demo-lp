# お問い合わせフォーム — セットアップ手順

## 1. reCAPTCHA

サイトキーはフロントに設定済みです。シークレットキーは **GAS のスクリプトプロパティのみ** に設定してください（フロントに書かないこと）。

[reCAPTCHA 管理コンソール](https://www.google.com/recaptcha/admin) のドメイン一覧に以下を追加してください。

- `mongolia-tour.hajime-web-port.com`（本番）
- `localhost`（ローカル開発用）

## 2. Google Apps Script のデプロイ

1. [script.google.com](https://script.google.com) に `kura.ai.3698@gmail.com` でログイン
2. 「新しいプロジェクト」を作成
3. `docs/gas-form-handler.gs` の内容を `Code.gs` に貼り付け
4. 左メニュー「プロジェクトの設定」→「スクリプト プロパティ」→ プロパティを追加

   | プロパティ | 値 |
   | --- | --- |
   | `RECAPTCHA_SECRET_KEY` | reCAPTCHA のシークレットキー |

5. 「デプロイ」→「新しいデプロイ」
   - 種類: **ウェブアプリ**
   - 説明: お問い合わせフォーム（任意）
   - 実行ユーザー: **自分**
   - アクセスできるユーザー: **全員**
6. デプロイ後に表示される **ウェブアプリ URL**（`/exec` で終わる）をコピー

### CORS 回避について

フロントから GAS へは `fetch` ではなく、**hidden iframe への form POST + `postMessage`** で送信しています。GAS 側は `HtmlService` で `parent.postMessage()` を返す実装になっています。

**GAS のコードを更新した場合**は、必ず「デプロイ」→「デプロイを管理」→ 鉛筆アイコン → **新バージョン** で再デプロイしてください。

## 3. フロントの URL 設定

`src/assets/js/parts/_form-config.js` の `FORM_SUBMIT_URL` を、手順 2 でコピーした URL に差し替えます。

```javascript
export const FORM_SUBMIT_URL =
  "https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec";
```

## 4. 動作確認

1. `npx gulp dev` でローカル起動（または本番アップロード後）
2. フォームにテスト送信
3. 以下を確認:
   - 「送信が完了しました」ポップアップが表示される
   - `kura.ai.3698@gmail.com` に問い合わせ内容メールが届く
   - 入力したメールアドレスに自動返信が届く
   - 送信失敗時、エラーが送信ボタンの下に表示される

## トラブルシューティング

| 症状 | 対処 |
| --- | --- |
| reCAPTCHA エラー | ドメイン登録・サイトキーの確認 |
| CORS エラー | GAS を新バージョンで再デプロイし、`postMessage` 対応の Code.gs になっているか確認 |
| 送信失敗（タイムアウト） | `FORM_SUBMIT_URL` が `/exec` URL か確認。GAS の実行ログを確認 |
| メールが届かない | GAS を所有する Google アカウントで初回承認が必要な場合あり。迷惑メールフォルダも確認 |
| GAS を更新した | 「デプロイ」→「デプロイを管理」→ 鉛筆アイコン → **新バージョン** で再デプロイ |
