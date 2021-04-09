/**
 * extensionからのmessageをcommandに変換して実行する。
 *
 * NOTE commandでなく、単なるfunction-tableで良かったかも.
 */ 
class MessageReceiver {

  /**
   * {"key": Command}
   * {"*": BypassCommand}
   * のようなkeyに対応するコマンドクラスを指定する。
   *
   * "key"は、chrome.runtime.onMessageのmessage.typeに対応する文字列。
   * Commandは
   *  interface Command { run(): any | promise<any> }
   * "*"は、特別なキーで、message.typeに該当する#commandMapのkeyが存在しない場合、*に対応するコマンドを実行する
   */ 
  #commandMap;

  constructor(commandMap) {
    this.#commandMap = commandMap;
  }

  run() {
     // onMessage.addLitenerの要請で、handlerが非同期処理の場合はtrue, それ以外はfalseを
     // 返す必要がある。
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      return this.#receivedMessage(msg, sender, sendResponse);
    });
  }

  #receivedMessage(msg, sender, sendResponse) {
    let commandClass = this.#commandMap[msg.type] || this.#commandMap["*"];
    if( !commandClass ) {
      return false;
    }
    let command = new commandClass();
    // NOTE 戻り値をtrue | falseにする必要があるので、await command.runは利用できない。
    let resultOrPromise = command.run(msg, sender);
    // 戻り値の非同期状態でcallbackの呼び方を分ける。
    if( isAsyncFunction(resultOrPromise) ) {
      let promise = resultOrPromise;
      promise.then( (response) => {
        if( sendResponse) {
          sendResponse(response);
        }
      });
      return true;
    } else if( sendResponse ) {
      let result = resultOrPromise;
      sendResponse(result);
      return false;
    }
  }
}
