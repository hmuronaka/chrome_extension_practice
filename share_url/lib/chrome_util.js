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
      chrome.tabs.query({ currentWindow: true, url: url }, function(...args) {
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
   * tabにpayloadを送信する
   */ 
  async sendMessageToTab(tab, payload) {
    return new Promise((resolve, reject) => {
      if( !tab ) {
        reject('tab is nil');
        return;
      }
      let payloadWithTab = {tabId: tab.id, ...payload};
      chrome.tabs.sendMessage(tab.id, payloadWithTab, (res) => {
        debugger;
        resolve(res);
      });
    });
  }

}




