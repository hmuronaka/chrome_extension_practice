class ShareWebPageCommand {
  async run(msg) {
    await ChromeExtension.shared.sendMessageToChatworkTab({
      type: 'select-room',
      roomUrl: msg.roomUrl
    });
    // TODO sleepは削除する。
    await sleepMilliseconds(1000);
    await ChromeExtension.shared.sendMessageToChatworkTab(msg);
  }
}

class BypassCommand {
  async run(msg) {
    return await ChromeExtension.shared.sendMessageToChatworkTab(msg);
  }
}
