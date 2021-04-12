# Share URL for Chatwork

表示しているページのTitleとURLを簡単にChatworkで共有できるだけのextension。
という内容のextension習作。

# インストール

作成中

## 前準備
1. このextensionをインストールして、このextensionのアイコンをピン留めさせる

# 使い方

1. Chatworkのページを開く（このextensionを利用するためには、開いておく必要がある)
2. Chatworkで共有したいtabを表示している状態で、このextensionのアイコンをクリックする
3. 投稿先のルームを選択して、必要なら本文を編集してSHAREボタンをクリックする
  （現状では)Chatworkのページのルームが変わり、テキスト欄に2で投稿した内容が貼り付けられる
4.（現状では)ユーザーがChatworkのタブを開いて、テキストを投稿する

# ディレクトリ構成

|Directory|説明|
|:--------|:---|
|background|ページに関わらず常駐するjs|
|content_scripts|Chatworkのページを開く際に読み込むjs|
|lib|ライブラリ|
|popup|Chromeのtoolbar上で表示するpopupのhtmlとjs|

# 設計イメージ

※ 図を表示するためには、plantumlのviewer のextensionが必要

## メッセージ通信の方針

popupは必ずbackgroundを介してcontent_script(Chatworkのページ)にアクセスする。

popup.jsは、popupが表示されている時点でしか存在しないようなので、tabを変更するなどする際には、
background.jsで処理を行う必要がある。message passingの流れを簡易にするためにpopup <-> content_script間の
通信は行わず、popup <-> background <-> content_script間でmessage passingを行う。

## シーケンス図例

### ルーム一覧の取得

@startuml

actor user as user
participant popup as popup
participant background_js as background
participant content_script_js as content_script
participant ChatworkのDOM as chatworkDOM

user ->> popup: ルーム一覧を取得する
popup -> background: ルーム一覧を取得する
background -> content_script: ルーム一覧を取得する
content_script -> chatworkDOM: DOMからルーム一覧を取得する
content_script --> background: ルーム一覧情報
background --> popup: ルーム一覧情報
popup -> popup: ルーム一覧を表示する

@enduml

### 本文投稿のシーケンス

@startuml

actor user as user
participant popup as popup
participant background_js as background
participant content_script_js as content_script
participant ChatworkのDOM as chatworkDOM

user ->> popup: 本文を投稿する
popup -> background: 本文を投稿する
background -> content_script: ルームを変更する
content_script -> chatworkDOM: ルームを変更する
background -> background: (現状は1sec sleep)
background -> content_script: 本文を投稿する
content_script -> chatworkDOM: 本文を投稿する

@enduml

## クラス図

@startuml

package popup {
  class Popup {
    Select roomSelect
    TextArea textArea
    getRooms()
    sendText()
  }
}

package lib {
  class MessageReceiver {
    run()
    receivedMessage(message, sender, callback)
  }

  class Command {
    run(message)
  }  
  MessageReceiver o--> Command

}

package background {
  class SendTextCommand {
  }
  class BypassCommand {
  }

  Command <|- SendTextCommand
  Command <|- BypassCommand
}  

package content_scripts {
  class SendTextCommand {
  }
  class GetRoomNamesCommand {
  }
  class SelectRoomCommand {
  }

  Command <|- SendTextCommand
  Command <|- GetRoomNamesCommand
  Command <|- SelectRoomCommand
}  

@enduml


