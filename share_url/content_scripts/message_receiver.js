/**
 * popupからのメッセージに対する処理を実行する
 */
class MessageReceiver {
  #commandMap = {
    'share-web-page': ChatSendCommand,
    'get-room-name': GetRoomNameCommand,
    'get-rooms-name': GetRoomNamesCommand
  }

  constructor() {}

  run() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      return this.#receivedMessage(msg, sender, sendResponse);
    });
  }

  #receivedMessage(msg, sender, sendResponse) {
    let commandClass = this.#commandMap[msg.type];
    if( commandClass ) {
      let command = new commandClass();
      let response = command.run(msg, sender);
      if( response && sendResponse) {
        sendResponse(response);
        return true;
      }
    }
    return false;
  }
}


