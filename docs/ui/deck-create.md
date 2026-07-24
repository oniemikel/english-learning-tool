# デッキ作成

## 目的

新しい単語帳を作成し、単語登録または学習準備へ進む。

## URL

`/decks/new`

## 利用者

認証済み利用者。

## レイアウト構成

共通App Shell内に戻るリンク、幅640pxのフォームカード、保存Action Barを表示する。MobileではAction Barを下部固定する。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| DeckForm | デッキ情報入力 | editing / invalid / saving |
| ColorPicker | カード識別色 | default |
| SaveActionBar | 作成・取消 | idle / saving |

## 表示項目

作成ガイド、入力文字数、公開設定の説明。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| デッキ名 | Text | ○ | 空 | 1〜100文字、前後空白除去 |
| 説明 | TextArea | × | 空 | 1000文字以内 |
| 公開設定 | Switch | ○ | false | boolean |
| 色 | Color picker | × | accent | 定義済みトークンのみ |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 作成 | Zod検証後、作成し詳細へ遷移 |
| キャンセル | 未保存変更時は確認後`/decks`へ遷移 |

## ダイアログ

未保存変更の破棄確認Dialog。

## エラー表示

各項目下のField Errorとフォーム上部Alert。

## ローディング表示

保存中はフォームを無効化し、作成ボタンにSpinnerを表示する。

## 空データ表示

該当なし。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/decks` | POST | 作成済みDeck |

## 状態管理

React Hook Form + Zod: フォーム。React State: 破棄確認。TanStack Query: 作成Mutation。

## 画面遷移

```mermaid
flowchart LR
  Create -->|保存| Detail[/decks/id]
  Create -->|取消| Decks[/decks]
```

## レスポンシブ仕様

PC/Tablet: 中央フォーム。Mobile: 全幅フォーム、保存操作を下部固定する。
