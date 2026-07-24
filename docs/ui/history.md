# 学習履歴

## 目的

日付・デッキ・モード別に学習履歴を確認し、復習傾向を把握する。

## URL

`/history`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 期間フィルタ。
- サイドバー: 共通ナビ。
- メインコンテンツ: フィルター、履歴テーブル、日次サマリー。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: テーブル→カード。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| HistoryFilter | 期間・デッキ・モード絞り込み | default |
| HistoryTable | 履歴一覧 | loading / loaded / empty |
| DailySummaryCard | 日次集計 | loaded |

## 表示項目

実施日時、デッキ、モード、問題数、正答率、学習時間。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 期間 | Date Range | ○ | 直近7日 | 開始<=終了 |
| デッキ | Select | × | all | 既存Deck |
| モード | Select | × | all | 定義モード |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 絞り込む | 条件で再取得 |
| クリア | 初期条件へ戻す |

## ダイアログ

なし。

## エラー表示

取得失敗Alert。

## ローディング表示

テーブルSkeleton。

## 空データ表示

該当履歴なしメッセージ。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/history` | GET | 学習履歴一覧 |

## 状態管理

TanStack Query: 履歴取得。URL Parameter: `from`, `to`, `deckId`, `mode`。

## 画面遷移

```mermaid
flowchart LR
  History --> Statistics[/statistics]
  History --> DeckDetail[/decks/:id]
```

## レスポンシブ仕様

Mobileでは1件をカード化し、主要指標のみ表示。
