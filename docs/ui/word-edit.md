# 単語編集

## 目的

既存単語の内容を更新し、学習対象からの除外/解除を行う。

## URL

`/words/[id]?mode=edit`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: パンくず・更新日時。
- サイドバー: 共通ナビ。
- メインコンテンツ: 編集フォーム、状態切替、危険操作。
- フッター: Mobileは保存バー固定。
- レスポンシブ時のレイアウト: 1カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| WordForm | 内容編集 | loading / editing / saving |
| ExcludeSwitch | 学習除外切替 | active / excluded |
| DangerZone | 削除操作 | default / deleting |

## 表示項目

更新日時、学習状態、関連デッキ。

## 入力項目

単語作成と同一。

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 保存 | 更新して詳細へ戻る |
| 削除 | 削除確認Dialog |
| キャンセル | 詳細へ戻る |

## ダイアログ

削除確認Dialog。

## エラー表示

取得失敗・更新失敗・削除失敗をAlert表示。

## ローディング表示

初期読込Skeleton、保存中は操作無効。

## 空データ表示

Not Found時は一覧への戻るリンク。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/words/[id]` | PATCH | 更新済みWord |
| Mock `/api/words/[id]` | DELETE | 削除完了 |

## 状態管理

React Hook Form + Zod。TanStack Query: 詳細/更新/削除。URL Parameter: `id`, `mode`。

## 画面遷移

```mermaid
flowchart LR
  Edit -->|保存| Detail[/words/id]
  Edit -->|削除| Words[/words]
```

## レスポンシブ仕様

PC: 編集と危険操作カードを分離。Mobile: 縦積み。
