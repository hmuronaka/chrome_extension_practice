/**
 * urlとtitleを指定したルームに共有する.
 *
 * chatworkのページのルームを変更して、メッセージ欄に
 * url+titleを貼り付ける
 */ 
class ShareWebPageCommand {
  /**
   * msg: {
      type: 'share-web-page',
      roomUrl: 投稿先ルームのurl,
      text: 送信する本文
    }
   */ 
  async run(msg) {
    await ChromeExtension.shared.sendMessageToChatworkTab({
      type: 'select-room',
      roomUrl: msg.roomUrl
    });
    // TODO sleepは削除する。
    await sleepMilliseconds(1000);
    // chatworkにmsg share-web-pageをそのまま送信する。
    await ChromeExtension.shared.sendMessageToChatworkTab(msg);
  }
}

/**
 * msgをそのままchatworkに流すだけのコマンド
 */ 
class BypassCommand {
  async run(msg) {
    return await ChromeExtension.shared.sendMessageToChatworkTab(msg);
  }
}
