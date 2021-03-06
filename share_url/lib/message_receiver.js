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

  /**
   * 受信したメッセージからCommandのインスタンスを生成して実行する。
   * Commandの実行結果をMessageReceiveResultのインスタンスに格納してsendResponseに渡す。
   * (MessageReceiverResultを介するのは処理の成功/失敗をメッセージの送信元に渡せるようにするため）
   *
   * @param msg 送信されたメッセージ
   * @param sender 送信者
   * @param sendResponse 送信元に結果を返すためのcallback関数
   * @return 非同期処理を行う場合trueを返す。同期処理の場合falseを返す
   */ 
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

/**
 * MessageReceiverの処理結果を表す
 */ 
class MessageReceiverResult {
  #isSuccess = false;
  /** #isSucess == trueの時、結果を保持する. #isSucess == falseの時は未定義 */
  #value;
  /**
   * #isSucess == falseの時、errorを表す値を保持する. #isSucess == trueの時は未定義.
   * ただしErrorのインスタンスは、content_script / background / popupを跨げないので、
   * Objectとして表現する
   */
  #error;

  /**
   * インスタンスを生成する
   * objはErrorオブジェクトのインスタンスを想定
   */ 
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
      // JSONから復元するための情報として、classNameを保持する
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
