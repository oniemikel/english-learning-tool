# 発音学習

## 目的

発話認識結果から発音品質を確認し、改善につなげる。

## URL

`/study/pronunciation`

## 利用者

認証済み利用者。

## レイアウト構成

- ヘッダー: 進捗。
- メインコンテンツ: お題表示、録音ボタン、認識結果、評価。
- フッター: Mobileは録音ボタン固定。
- レスポンシブ時のレイアウト: 単一カラム。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| PromptCard | 発話課題表示 | default |
| RecorderButton | 録音開始/停止 | idle / recording / processing |
| PronunciationScore | 評価表示 | hidden / shown |

## 表示項目

お題単語、発音記号、認識テキスト、一致率、進捗。

## 入力項目

| 項目名 | 型 | 必須 | 初期値 | バリデーション |
| --- | --- | --- | --- | --- |
| 音声入力 | Microphone | ○ | - | ブラウザ許可必須 |

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| 録音開始/停止 | 音声認識を制御 |
| スキップ | 次問題へ |
| 終了 | 結果へ遷移 |

## ダイアログ

マイク権限未許可時の案内Dialog。

## エラー表示

認識失敗・権限拒否をAlert表示。

## ローディング表示

認識処理中インジケータ。

## 空データ表示

発音対象0件時は結果へ遷移。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| Mock `/api/study/review` | POST | 発音評価結果 |

## 状態管理

Zustand: セッション。React State: 録音状態、認識結果。

## 画面遷移

```mermaid
flowchart LR
  Pronunciation --> Pronunciation
  Pronunciation --> Result[/study/result]
```

## レスポンシブ仕様

Mobileでは録音ボタンを画面下中央に配置。
