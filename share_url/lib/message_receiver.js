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
    //  sendResponseに返すオブジェクトの型はMessageReceiverResult
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      return this.#receivedMessage(msg, sender, sendResponse);
    });
  }

  #receivedMessage(msg, sender, sendResponse) {
    let commandClass = this.#commandMap[msg.type] || this.#commandMap["*"];
    if( !commandClass ) {
      let error = new Error(`command is not found. msg.type: ${msg.type}`);
      sendResponse(MessageReceiverResult.error(error));
      return false;
    }
    let command = new commandClass();
    // NOTE 戻り値をtrue | falseにする必要があるので、await command.runは利用できない。
    let resultOrPromise;
    try {
      resultOrPromise = command.run(msg, sender);
    } catch(error) {
      sendResponse(MessageReceiverResult.error(error));
      return false;
    }
    // 戻り値の非同期状態でcallbackの呼び方を分ける。
    if( isAsyncFunction(resultOrPromise) ) {
      let promise = resultOrPromise;
      promise.then( (response) => {
        if( sendResponse) {
          sendResponse(MessageReceiverResult.success(response));
        }
      }).catch( (error) => {
        sendResponse(MessageReceiverResult.error(error));
      });
      return true;
    } else if( sendResponse ) {
      let result = MessageReceiverResult.success(resultOrPromise);
      sendResponse(result);
      return false;
    }
  }
}

class MessageReceiverResult {
  #isSuccess = false;
  #value;
  #error;

  constructor(obj) {
    this.#isSuccess = !!obj.isSuccess;
    this.#value = obj.value;
    if( obj.error instanceof Error ) {
      this.#error = {
        name: obj.error.name,
        message: obj.error.message,
        stack: obj.error.stack
      };
    } else {
      this.#error = obj.error;
    }
  }

  get isSuccess() { return this.#isSuccess; }
  get value() { return this.#value; }
  get error() { return this.#error; }

  toJSON() {
    return {
      className: MessageReceiverResult.name,
      isSuccess: this.#isSuccess,
      value: this.#value,
      error: this.#error
    }
  }

  static success(value) {
    return new MessageReceiverResult({
      isSuccess: true,
      value: value
    });
  }

  static error(error) {
    return new MessageReceiverResult({
      isSuccess: false,
      error: error
    });
  }

}
