# CSVインポート

## 目的

CSVから単語をデッキへ一括登録し、検証結果を確認して安全に反映する。

## URL

`/decks/import?deckId=[id]`

## 利用者

認証済みのデッキ所有者。

## レイアウト構成

共通App Shell内に、対象デッキ表示、Dropzone、重複時動作、プレビュー表、結果サマリーを順に配置する。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| CsvDropzone | ファイル選択 | idle / dragging / parsing |
| ImportOptions | 重複時動作 | default |
| CsvPreviewTable | 行別検証結果 | valid / invalid |
| ImportResult | 完了件数 | success / partial-failure |

## 表示項目

対象デッキ、CSV列の説明、総行数、成功・失敗件数、エラー行。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| CSVファイル | File | ○ | 未選択 | `.csv`、10MB以下 |
| 重複時動作 | Select | ○ | スキップ | スキップ / 更新 |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| ファイルを選択 | File pickerを開く |
| インポート | プレビュー済み有効行を登録 |
| キャンセル | デッキ詳細へ戻る |

## ダイアログ

大量登録時の確認Dialogと、離脱時の破棄確認Dialog。

## エラー表示

ファイル形式・列不足・行別バリデーションを表内とAlertで表示する。

## ローディング表示

解析・登録中は進捗バーを表示する。

## 空データ表示

未選択時はサンプルCSV説明を表示する。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/decks/[id]/words/import` | POST | 成功・失敗行と件数 |

## 状態管理

React State: ファイル・プレビュー・進捗。React Hook Form + Zod: 選択肢。URL Parameter: `deckId`。

## 画面遷移

```mermaid
flowchart LR
  Import -->|成功| Detail[/decks/id]
  Import -->|取消| Detail
```

## レスポンシブ仕様

PC: 表形式プレビュー。Tablet/Mobile: エラー行をカード化し、列は必要最小限に絞る。
