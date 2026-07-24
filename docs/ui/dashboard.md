# ダッシュボード

## 目的

Dueカード数、今日の学習状況、最近の履歴、デッキ概要から次の学習を開始できるようにする。

## URL

`/dashboard`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 検索、同期状態、テーマ、ユーザーメニュー。
- サイドバー: ダッシュボード、学習、デッキ、単語、統計、設定。
- メインコンテンツ: 学習開始CTA、KPIカード、Dueカード、最近の履歴、デッキカード。
- フッター: PCでは不要、MobileではBottom Navigation。
- レスポンシブ時: KPIは4→2→1列、サイドバーはBottom Navigationへ置換。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| StudyHero | 学習開始導線 | ready / empty |
| StatisticCard | 今日のKPI | loading / loaded |
| DueCardPanel | Due一覧 | loaded / empty / offline |
| DeckPreviewList | 最近のデッキ | loaded / empty |

## 表示項目

Due数、新規カード数、今日の学習数、継続日数、直近レビュー、デッキ名・進捗。

## 入力項目

入力なし。

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 学習を始める | `/study`へ遷移 |
| すべてのデッキ | `/decks`へ遷移 |
| 統計を見る | `/statistics`へ遷移 |

## ダイアログ

同期競合がある場合のみ同期詳細Dialogを表示する。

## エラー表示

各カード内に再試行可能なInline Alertを表示する。

## ローディング表示

KPI・リストはSkeletonで表示する。

## 空データ表示

デッキ未作成時は「最初のデッキを作成」、Dueなし時は達成メッセージを表示する。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| `/api/statistics/dashboard` | GET | 学習KPI・直近履歴・Due概要 |
| Mock Deck service | GET | 最近のデッキ一覧 |

## 状態管理

TanStack Query: ダッシュボード集計。Zustand: 同期・テーマ。React State: 同期Dialog。

## 画面遷移

```mermaid
flowchart LR
  Dashboard --> Study[/study]
  Dashboard --> Decks[/decks]
  Dashboard --> Statistics[/statistics]
```

## レスポンシブ仕様

PC: 2カラムの情報カード。Tablet: 1カラム中心。Mobile: KPI横スクロールなし、Bottom Navigation表示。
