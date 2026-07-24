# 公開デッキ一覧

## 目的

他ユーザーの公開デッキを検索・閲覧し、複製候補を見つける。

## URL

`/public-decks`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 検索。
- サイドバー: 共通ナビ。
- メインコンテンツ: 検索、カテゴリ、公開デッキカード。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: 3/2/1列カード。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| PublicDeckSearch | キーワード検索 | default / searching |
| PublicDeckCard | 公開情報表示 | loading / loaded |
| CategoryFilter | 難易度・タグ | default |

## 表示項目

デッキ名、作成者、単語数、評価、複製数、更新日、タグ。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 検索 | Text | × | 空 | 100文字以内 |
| タグ | MultiSelect | × | all | 既存タグのみ |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 詳細を見る | `/public-decks/[id]`へ遷移 |

## ダイアログ

なし。

## エラー表示

取得失敗時にAlert。

## ローディング表示

カードSkeletonを表示。

## 空データ表示

条件一致なしメッセージと検索解除CTA。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/public-decks` | GET | 公開デッキ一覧 |

## 状態管理

TanStack Query: 一覧取得。URL Parameter: `q`, `tag`。

## 画面遷移

```mermaid
flowchart LR
  PublicDecks --> Detail[/public-decks/:id]
```

## レスポンシブ仕様

PC: 3列、Tablet: 2列、Mobile: 1列。
