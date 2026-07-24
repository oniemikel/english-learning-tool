# 単語詳細

## 目的

単語の詳細情報を確認し、編集・音声再生・学習関連操作へ進む。

## URL

`/words/[id]`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: パンくず・アクション。
- サイドバー: 共通ナビ。
- メインコンテンツ: 基本情報カード、意味・例文カード、語源/類義語カード。
- フッター: MobileのみBottom Navigation。
- レスポンシブ時のレイアウト: PCは2カラム、Mobileは縦積み。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| WordHeader | タイトルと操作 | loading / loaded |
| PronunciationPlayer | 発音再生 | ready / loading / error |
| MetadataCard | 語源・類義語等 | default / empty |

## 表示項目

英単語、日本語訳、英英定義、品詞、発音記号、音声、例文、語源、類義語、対義語、コロケーション。

## 入力項目

なし。

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 編集 | `/words/[id]?mode=edit`へ遷移 |
| この単語を学習 | `/study?wordId=[id]`へ遷移 |
| 音声再生 | 音声を再生 |

## ダイアログ

削除確認Dialog。

## エラー表示

Not Found、取得失敗を状態表示。

## ローディング表示

詳細カードSkeletonを表示。

## 空データ表示

任意項目未登録時は「未登録」と表示。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/words/[id]` | GET | 単語詳細 |

## 状態管理

TanStack Query: 単語詳細。URL Parameter: `id`。React State: 削除Dialog。

## 画面遷移

```mermaid
flowchart LR
  Detail --> Edit[/words/id?mode=edit]
  Detail --> Study[/study?wordId=id]
  Detail --> Words[/words]
```

## レスポンシブ仕様

PC: 詳細2カラム。Tablet/Mobile: 1カラム。
