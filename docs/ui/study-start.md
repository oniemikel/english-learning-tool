# 学習開始

## 目的

対象デッキと学習モードを選択し、学習セッションを開始する。

## URL

`/study`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: ページタイトル。
- サイドバー: 共通ナビ。
- メインコンテンツ: セッション設定カード、モード選択カード、開始CTA。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: 2カラムから1カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| DeckSelector | 学習対象選択 | loaded / empty |
| SessionSettingForm | 上限・順序設定 | editing / invalid |
| StudyModeCards | モード比率選択 | default |

## 表示項目

Due数、新規数、推奨学習時間、モード説明。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| デッキ | Select | ○ | 先頭デッキ | 既存Deck |
| 新規上限 | Number | ○ | 20 | 0〜200 |
| レビュー上限 | Number | ○ | 100 | 0〜500 |
| 学習順序 | Select | ○ | DUE_ASC | Enum |
| 学習モード | Radio | ○ | EN_JA | 定義モード |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 学習を開始 | 選択モード画面へ遷移 |

## ダイアログ

中断中セッション再開Dialog（必要時）。

## エラー表示

デッキ未選択・上限不正をフォームエラー表示。

## ローディング表示

設定取得中Skeleton。

## 空データ表示

デッキ0件の場合は作成CTAを表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/study/session/prepare` | GET | 学習候補件数 |

## 状態管理

React Hook Form + Zod。Zustand: 学習セッション設定。URL Parameter: `deckId`, `mode`。

## 画面遷移

```mermaid
flowchart LR
  StudyStart --> ENJA[/study/en-ja]
  StudyStart --> JAEN[/study/ja-en]
  StudyStart --> Listening[/study/listening]
  StudyStart --> Pronunciation[/study/pronunciation]
```

## レスポンシブ仕様

Mobileはモードカードを縦積み。
