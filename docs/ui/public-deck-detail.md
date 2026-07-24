# 公開デッキ詳細

## 目的

公開デッキの内容を確認し、自分のデッキへ複製する。

## URL

`/public-decks/[id]`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 戻る、複製CTA。
- サイドバー: 共通ナビ。
- メインコンテンツ: デッキ概要、単語サンプル、評価情報。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: 1カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| PublicDeckHero | 概要表示 | loading / loaded |
| SampleWordTable | 単語サンプル | loaded / empty |
| CloneActionCard | 複製処理 | idle / cloning / done |

## 表示項目

デッキ名、作成者、説明、タグ、単語数、評価、サンプル単語。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 複製後デッキ名 | Text | ○ | 元デッキ名 | 1〜100文字 |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| このデッキを複製 | 複製して`/decks/[id]`へ遷移 |

## ダイアログ

複製確認Dialog（任意）。

## エラー表示

複製失敗をAlert表示。

## ローディング表示

詳細読込Skeleton、複製中Spinner。

## 空データ表示

サンプルがない場合は説明文を表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/public-decks/[id]` | GET | 公開デッキ詳細 |
| Mock `/api/public-decks/[id]/clone` | POST | 複製されたDeck |

## 状態管理

TanStack Query: 詳細。React Hook Form + Zod: 複製名入力。

## 画面遷移

```mermaid
flowchart LR
  PublicDetail -->|複製| DeckDetail[/decks/id]
  PublicDetail -->|戻る| PublicDecks[/public-decks]
```

## レスポンシブ仕様

Mobileは単語表をカード化し、複製CTAを下部固定。
