// chrome extensionのutilities

class ChromeExtension {
  static shared = new ChromeExtension();

  /**
   * 新規タブを生成してurlを開く
   */ 
  async createNewTab(url, option) {
    value = { 
      url: url,
      ...option
    };
    return new Promise( (resolve, reject) => {
      chrome.tabs.create(value , (tab) => {
        resolve(tab);
      });
    });
  }

  /**
   * urlを表示している先頭のtabを探す
   */ 
  async findTab(url) {
    return new Promise((resolve, reject) => {
      // NOTE currentWindow: trueがあるとbackgroundで期待した動作をしない
      //      ことがあるため、いったん除外。
      chrome.tabs.query({ url: url }, function(...args) {
        const [tab] = Array.from(args[0]);
        if( tab && tab.url ) {
          resolve(tab);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * tabにmessageを送信する
   */ 
  async sendMessageToTab(tab, message) {
    return new Promise((resolve, reject) => {
      if( !tab ) {
        reject('tab is nil');
        return;
      }
      let messageWithTab = {tabId: tab.id, ...message};
      chrome.tabs.sendMessage(tab.id, messageWithTab, (res) => {
        // resはMessageReceiverResultのJSON表現 | any を想定している。
        // chrome extensionのMessage Passingは、JSONオブジェクトしか渡せなず
        // 直接MessageReceiverResultのインスタンスを渡せないため、JSONから
        // MessageReceiverResultインスタンスへの復元を行う。
        // https://developer.chrome.com/docs/extensions/mv3/messaging/
        if( res && res.className === MessageReceiverResult.name ) {
          res = new MessageReceiverResult(res);
          if( res.isSuccess ) {
            resolve(res.value);
          } else {
            reject(res.error);
          }
        } else {
          resolve(res);
        }
      });
    });
  }

  async findChatworkTab() {
    return await this.findTab('https://www.chatwork.com/');
  }

  async sendMessageToChatworkTab(message) {
    let tab = await this.findChatworkTab();
    if( !tab ) {
      throw "chatwork's tab was not found.";
    }
    return await this.sendMessageToTab(tab, message);
  }

  /**
   * backgroundにメッセージ通信を行う
   */ 
  async sendMessage(message) {
    return new Promise((resolve, reject) => {
      // resはMessageReceiverResultのJSON表現 | any を想定している。
      // chrome extensionのMessage Passingは、JSONオブジェクトしか渡せなず
      // 直接MessageReceiverResultのインスタンスを渡せないため、JSONから
      // MessageReceiverResultインスタンスへの復元を行う。
      // https://developer.chrome.com/docs/extensions/mv3/messaging/
      chrome.runtime.sendMessage(message, (res) => {
        if( res && res.className === MessageReceiverResult.name ) {
          res = new MessageReceiverResult(res);
          if( res.isSuccess ) {
            resolve(res.value);
          } else {
            reject(res.error);
          }
        } else {
          resolve(res);
        }
      });
    });
  }
}




