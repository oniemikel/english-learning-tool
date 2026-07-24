# 学習結果

## 目的

学習セッションの結果を要約表示し、次アクションへつなげる。

## URL

`/study/result`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 完了表示。
- サイドバー: 共通ナビ。
- メインコンテンツ: KPIカード、苦手単語、再学習CTA。
- フッター: MobileはBottom Navigation。
- レスポンシブ時のレイアウト: 2→1カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| ResultSummary | 結果要約 | loaded |
| WeakWordList | 苦手単語表示 | loaded / empty |
| NextActionCard | 次の学習導線 | default |

## 表示項目

学習件数、正答率、学習時間、評価分布、次回Due。

## 入力項目

なし。

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 同じ設定で再開 | `/study`へ設定付き遷移 |
| ダッシュボードへ戻る | `/dashboard`へ遷移 |
| 履歴を見る | `/history`へ遷移 |

## ダイアログ

なし。

## エラー表示

保存失敗時はローカル保存案内と再同期ボタン。

## ローディング表示

結果集計中Skeleton。

## 空データ表示

結果がない場合はダッシュボード導線。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/study/session/result` | GET | セッション結果 |

## 状態管理

TanStack Query: 結果取得。Zustand: 直前セッション情報。

## 画面遷移

```mermaid
flowchart LR
  Result --> StudyStart[/study]
  Result --> Dashboard[/dashboard]
  Result --> History[/history]
```

## レスポンシブ仕様

Mobileは主要KPIを先頭に集約。
