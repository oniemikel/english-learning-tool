# 統計

## 目的

学習の成果と傾向を可視化し、改善ポイントを把握する。

## URL

`/statistics`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 期間切替。
- サイドバー: 共通ナビ。
- メインコンテンツ: KPIカード、推移チャート、モード別分析、苦手分析。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: ダッシュボード風グリッド。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| KPIGrid | 主要指標 | loading / loaded |
| TrendChartCard | 日次推移 | loaded / empty |
| WeaknessPanel | 苦手分析 | loaded |

## 表示項目

総学習回数、総レビュー、継続日数、正答率、学習時間、モード別比率。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 集計期間 | Segmented | ○ | 7日 | 7/30/90日 |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 期間変更 | 再集計 |

## ダイアログ

なし。

## エラー表示

集計取得失敗Alert。

## ローディング表示

カードSkeletonとチャートプレースホルダ。

## 空データ表示

履歴不足時に学習開始CTAを表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/statistics` | GET | 統計サマリーと系列 |

## 状態管理

TanStack Query: 統計取得。URL Parameter: `range`。

## 画面遷移

```mermaid
flowchart LR
  Statistics --> Study[/study]
  Statistics --> History[/history]
```

## レスポンシブ仕様

MobileはKPIを2列、チャートは横スクロール可能。
