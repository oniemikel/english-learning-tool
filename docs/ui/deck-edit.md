# デッキ編集

## 目的

デッキ名、説明、公開設定、識別色、アーカイブ状態を更新する。

## URL

`/decks/[id]?mode=edit`

## 利用者

認証済みの所有者。

## レイアウト構成

Deck作成と同じフォーム構成に、アーカイブ・削除を含む危険操作カードを追加する。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| DeckForm | 通常編集 | loading / editing / saving |
| ArchiveSwitch | 学習対象からの除外 | active / archived |
| DangerZone | 削除操作 | default / deleting |

## 表示項目

更新日時、単語数、公開設定の説明、アーカイブの影響。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| デッキ名 | Text | ○ | 現在値 | 1〜100文字 |
| 説明 | TextArea | × | 現在値 | 1000文字以内 |
| 公開設定 | Switch | ○ | 現在値 | boolean |
| アーカイブ | Switch | ○ | false | boolean |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 保存 | 更新後`/decks/[id]`へ戻る |
| 削除 | 確認Dialogを開く |
| キャンセル | 未保存変更を確認し詳細へ戻る |

## ダイアログ

削除確認Dialog。削除後は`/decks`へ遷移する。

## エラー表示

取得失敗・保存失敗・削除失敗をAlertで表示する。

## ローディング表示

初期取得はフォームSkeleton、保存・削除中は操作を無効化する。

## 空データ表示

Not Found時は一覧へ戻るリンクを表示する。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/decks/[id]` | PATCH | 更新済みDeck |
| Mock `/api/decks/[id]` | DELETE | 削除完了 |

## 状態管理

React Hook Form + Zod。TanStack Query: 詳細・Mutation。URL Parameter: `id`、`mode`。

## 画面遷移

```mermaid
flowchart LR
  Edit -->|保存| Detail[/decks/id]
  Edit -->|削除| Decks[/decks]
  Edit -->|取消| Detail
```

## レスポンシブ仕様

PC: 編集と危険操作を分離。Tablet/Mobile: 縦積み、削除は十分な間隔を確保する。
