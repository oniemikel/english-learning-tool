# リスニング学習

## 目的

単語・例文音声を聞き取り、認識精度を向上させる。

## URL

`/study/listening`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 進捗。
- メインコンテンツ: 音声プレイヤー、選択肢/入力、評価。
- フッター: Mobileは再生・回答操作を固定。
- レスポンシブ時のレイアウト: 単一カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| AudioPlayer | 音声再生 | loading / ready / error |
| ListeningAnswer | 回答UI | idle / submitted |
| WavePlaceholder | 再生可視化 | playing / paused |

## 表示項目

再生速度、再生回数、進捗、ヒント。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 回答 | Text or Select | ○ | 空 | 1文字以上 |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 再生 | 音声を再生 |
| 回答送信 | 正誤判定 |
| 終了 | 結果へ遷移 |

## ダイアログ

中断確認Dialog。

## エラー表示

音声取得失敗時に再試行CTA。

## ローディング表示

音声ロード時Skeleton。

## 空データ表示

音声なしカードは次カードへスキップ。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/study/session/next` | GET | 音声URL付きカード |

## 状態管理

Zustand: セッション。React State: 再生状態、入力値。

## 画面遷移

```mermaid
flowchart LR
  Listening --> Listening
  Listening --> Result[/study/result]
```

## レスポンシブ仕様

Mobileは操作ボタンを大きくし誤タップを防止。
