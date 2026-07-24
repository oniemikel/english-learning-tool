# デッキ一覧

## 目的

利用者のデッキを検索・並べ替え・作成し、学習対象を選びやすくする。

## URL

`/decks`

## 利用者

認証済み利用者。

## レイアウト構成

共通App Shell内に、ページ見出し、検索・並び替え、デッキカードグリッド、作成CTAを配置する。MobileではフィルターをSheetへ格納する。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| DeckToolbar | 検索・並び替え | default / filtering |
| DeckCard | デッキ概要表示 | active / archived |
| EmptyState | 初回作成導線 | empty |

## 表示項目

デッキ名、説明、単語数、Due数、公開状態、アーカイブ状態、最終更新日。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 検索 | Text | × | 空 | 100文字以内 |
| 並び順 | Select | × | 更新日時順 | 作成日・名前・Due |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| デッキを作成 | `/decks/new`へ遷移 |
| デッキカード | `/decks/[id]`へ遷移 |

## ダイアログ

アーカイブ解除・削除は詳細画面で扱う。

## エラー表示

一覧上部のAlertと再試行ボタン。

## ローディング表示

DeckCard Skeletonを表示する。

## 空データ表示

「デッキがありません」と作成ボタンを表示する。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/decks` | GET | ページング済みデッキ一覧 |

## 状態管理

TanStack Query: 一覧。URL Parameter: `q`、`sort`。React State: フィルターSheet。

## 画面遷移

```mermaid
flowchart LR
  DeckList --> Create[/decks/new]
  DeckList --> Detail[/decks/:id]
```

## レスポンシブ仕様

PC: 3列グリッド。Tablet: 2列。Mobile: 1列、作成CTAを下部に固定する。
