# 単語一覧

## 目的

デッキ横断またはデッキ単位で単語を一覧し、検索・絞り込み・詳細遷移を行う。

## URL

`/words`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 検索ショートカット、テーマ切替、ユーザーメニュー。
- サイドバー: ダッシュボード、学習、デッキ、単語、統計、設定。
- メインコンテンツ: 検索バー、フィルター、単語カード/テーブル、作成CTA。
- フッター: MobileのみBottom Navigation。
- レスポンシブ時のレイアウト: PCはテーブル主体、Mobileはカード主体。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| WordToolbar | 検索・品詞/状態フィルター | default / filtering |
| WordTable | 単語一覧表示 | loading / loaded / empty |
| WordCard | Mobile表示 | default / excluded |

## 表示項目

英単語、日本語訳、品詞、所属デッキ、次回復習日、正答率、除外状態。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 検索 | Text | × | 空 | 100文字以内 |
| 品詞 | Select | × | all | Enum値 |
| 状態 | Select | × | ACTIVE | ACTIVE/EXCLUDED |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 単語を作成 | `/words/new`へ遷移 |
| 行クリック | `/words/[id]`へ遷移 |

## ダイアログ

一括除外時のみ確認Dialog。

## エラー表示

取得失敗時はAlertと再試行ボタン。

## ローディング表示

テーブルSkeletonまたはカードSkeleton。

## 空データ表示

検索条件に一致しない場合は条件解除CTAを表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/words` | GET | 単語一覧 |

## 状態管理

TanStack Query: 単語一覧取得。URL Parameter: `q`, `partOfSpeech`, `state`, `deckId`。React State: フィルター開閉。

## 画面遷移

```mermaid
flowchart LR
  Words --> Create[/words/new]
  Words --> Detail[/words/:id]
```

## レスポンシブ仕様

PC: 一覧テーブル。Tablet: 主要列のみ表示。Mobile: カード一覧と固定作成ボタン。
