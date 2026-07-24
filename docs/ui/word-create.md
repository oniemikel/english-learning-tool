# 単語作成

## 目的

単語を手動登録し、必要に応じてデッキへ紐付ける。

## URL

`/words/new`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 戻るリンク。
- サイドバー: 共通ナビ。
- メインコンテンツ: 幅広フォームカード、保存Action Bar。
- フッター: Mobileでは保存バー固定。
- レスポンシブ時のレイアウト: 1カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| WordForm | 入力と検証 | editing / invalid / saving |
| DeckSelect | 所属デッキ選択 | loaded / empty |
| SaveActionBar | 保存操作 | idle / saving |

## 表示項目

入力ガイド、必須項目説明、CSVインポート導線。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 英単語 | Text | ○ | 空 | 1〜100文字 |
| 日本語訳 | Text | ○ | 空 | 1〜500文字 |
| 品詞 | Select | × | OTHER | Enum値 |
| 英英定義 | TextArea | × | 空 | 2000文字以内 |
| 発音記号 | Text | × | 空 | 100文字以内 |
| 例文 | TextArea | × | 空 | 2000文字以内 |
| デッキ | Select | × | 未選択 | 既存Deck |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 作成 | 検証後に登録し詳細へ遷移 |
| キャンセル | 未保存確認後、一覧へ戻る |

## ダイアログ

未保存変更確認Dialog。

## エラー表示

項目下Field Errorとフォーム先頭Alert。

## ローディング表示

保存中はボタンにSpinner、フォーム無効化。

## 空データ表示

デッキが0件の場合はデッキ作成CTAを表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/words` | POST | 作成済みWord |

## 状態管理

React Hook Form + Zod。TanStack Query: 作成Mutation。URL Parameter: `deckId`。

## 画面遷移

```mermaid
flowchart LR
  Create -->|保存| Detail[/words/id]
  Create -->|取消| Words[/words]
```

## レスポンシブ仕様

PC/Tablet: 中央フォーム。Mobile: 全幅フォーム、保存バー固定。
