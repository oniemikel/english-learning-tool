# デッキ詳細

## 目的

デッキの概要、単語一覧、学習状況を確認し、学習・単語追加・編集へ進む。

## URL

`/decks/[id]`

## 利用者

認証済みの所有者。所有者以外はNot Foundとして扱う。

## レイアウト構成

共通App Shell内にパンくず、デッキ概要カード、学習CTA、単語プレビュー、アクションメニューを表示する。MobileではアクションをOverflow Menuへ集約する。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| DeckHeader | 名前・説明・進捗 | loading / loaded |
| DeckActionMenu | 編集・CSV・削除 | default |
| WordPreviewTable | 登録単語の抜粋 | loaded / empty |
| StudySummary | Due・新規数 | ready / empty |

## 表示項目

デッキ名、説明、公開状態、単語数、Due数、新規数、作成日、単語プレビュー。

## 入力項目

入力なし。

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| このデッキを学習 | `/study?deckId=[id]`へ遷移 |
| 単語を追加 | `/words/new?deckId=[id]`へ遷移 |
| 編集 | `/decks/[id]?mode=edit`へ遷移 |
| CSVインポート | `/decks/import?deckId=[id]`へ遷移 |

## ダイアログ

削除確認Dialog。単語・履歴への影響を説明し、明示入力なしでは削除しない。

## エラー表示

Not Found、権限なし、取得失敗をページ状態として表示する。

## ローディング表示

Headerと単語テーブルをSkeletonで表示する。

## 空データ表示

単語未登録時はCSVまたは手動登録のCTAを表示する。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/decks/[id]` | GET | デッキ・進捗・単語プレビュー |

## 状態管理

TanStack Query: デッキ詳細。URL Parameter: `id`、`mode`。React State: 削除Dialog。

## 画面遷移

```mermaid
flowchart LR
  Detail --> Study[/study?deckId=id]
  Detail --> AddWord[/words/new?deckId=id]
  Detail --> Edit[/decks/id?mode=edit]
  Detail --> Import[/decks/import?deckId=id]
```

## レスポンシブ仕様

PC: 概要と学習サマリーを横並び。Tablet/Mobile: 縦積み、単語表は横スクロールを許可する。
