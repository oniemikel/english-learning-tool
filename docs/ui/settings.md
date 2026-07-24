# 設定

## 目的

学習設定・表示設定・アカウント操作を管理する。

## URL

`/settings`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: セクション見出し。
- サイドバー: 共通ナビ。
- メインコンテンツ: 学習設定カード、表示設定カード、アカウントカード。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: 1カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| LearningSettingForm | 学習上限・順序 | editing / saving |
| AppearanceSetting | テーマ・フォントサイズ | default |
| AccountActions | サインアウト・データ操作 | default |

## 表示項目

現在設定値、最終同期時刻、アカウント情報。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 新規上限 | Number | ○ | 20 | 0〜200 |
| レビュー上限 | Number | ○ | 100 | 0〜500 |
| 学習順序 | Select | ○ | DUE_ASC | Enum |
| テーマ | Select | ○ | system | light/dark/system |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 保存 | 設定保存 |
| サインアウト | ログアウト処理 |

## ダイアログ

設定リセット確認Dialog。

## エラー表示

保存失敗時Alert。

## ローディング表示

初期取得時Skeleton、保存中Spinner。

## 空データ表示

設定未取得時はデフォルト値を表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/settings` | GET | 現在設定 |
| Mock `/api/settings` | PATCH | 更新設定 |

## 状態管理

React Hook Form + Zod。Zustand: 表示設定。TanStack Query: 設定取得/更新。

## 画面遷移

```mermaid
flowchart LR
  Settings --> Dashboard[/dashboard]
  Settings --> Login[/]
```

## レスポンシブ仕様

Mobileはセクション間の余白を広めに取り、誤操作を抑制。
