# 英→日学習

## 目的

英単語を提示し、日本語の意味想起を行う。

## URL

`/study/en-ja`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 進捗、終了。
- メインコンテンツ: 問題カード、回答表示、自己評価ボタン。
- フッター: Mobileは回答操作を下部固定。
- レスポンシブ時のレイアウト: 集中重視の単一カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| StudyProgressBar | 進捗表示 | running |
| PromptCard | 問題提示 | question / answer |
| GradeButtons | FSRS評価 | hidden / visible |

## 表示項目

英単語、ヒント、例文、進捗、残件数。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 自己評価 | Button group | ○ | 未選択 | AGAIN/HARD/GOOD/EASY |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 答えを見る | 日本語訳を表示 |
| Again/Hard/Good/Easy | 評価送信・次の問題へ |
| 学習を終了 | 結果画面へ遷移 |

## ダイアログ

学習中断確認Dialog。

## エラー表示

問題取得失敗を再読込導線付きで表示。

## ローディング表示

次問題取得中にカードフェード。

## 空データ表示

対象カード0件時は結果画面へ誘導。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/study/session/next` | GET | 次カード |
| Mock `/api/study/review` | POST | 更新後FSRS状態 |

## 状態管理

Zustand: セッション進捗。React State: 回答表示トグル。

## 画面遷移

```mermaid
flowchart LR
  ENJA --> ENJA
  ENJA --> Result[/study/result]
```

## レスポンシブ仕様

Mobileは片手操作前提で評価ボタンを横4分割。
