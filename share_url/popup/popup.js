/**
 * popup.htmlに対応するjs
 */ 
class Popup {

  ////////////////////////////////////////////////////////////////////////////////
  // attributes

  /** 表示中のURI表示 */
  #uriDiv;
  /** 表示中pageのタイトル */
  #titleDiv;
  /** ルーム一覧更新ボタン */
  #getRoomsButton;
  /** ルーム一覧 */
  #roomsSelect;

  constructor() {
  }

  ////////////////////////////////////////////////////////////////////////////////
  // public methods

  /** このオブジェクトをdocumentに割り当てる */
  attach(doc) {
    this.#uriDiv = doc.getElementById('tab-uri');
    this.#titleDiv = doc.getElementById('tab-title');
    this.#getRoomsButton = doc.getElementById('get-rooms-button');
    this.#roomsSelect = doc.getElementById('rooms-select');

    // 表示中のページの情報を取得する
    this.#getRoomsButton.addEventListener('click', () => this.getRoomsName() );
    chrome.tabs.query({ active: true, currentWindow: true }, (...args) => {
      const [tab] = Array.from(args[0]);
      this.#titleDiv.innerText = tab.title;
      this.#uriDiv.innerText = tab.url;
    });
    doc.getElementById('share-button').addEventListener('click', () => this.shareWebPage());

    this.getRoomsName();
  }

  get selectedRoom() {
    if( this.#roomsSelect.selectedIndex < 0 ) {
      return null;
    }
    return this.#roomsSelect.options[this.#roomsSelect.selectedIndex];
  }

  /** 表示中のURLとタイトルをRoomに投稿する */
  async shareWebPage() {
    if( !this.selectedRoom ) {
      return;
    }
    let roomUrl = this.selectedRoom.value;
    let payload = {
      type: 'share-web-page',
      url: this.#uriDiv.innerText,
      title: this.#titleDiv.innerText,
      roomUrl: roomUrl
    };

    let tab = await this.#findChatworkTab();
    if( tab ) {
      ChromeExtension.shared.sendMessageToTab(tab, payload);
    }
  }

  async getRoomsName() {
    let res = await this.#sendMessageToChatwork({ type: 'get-rooms-name' });
    this.#refreshRoomSelect( res.rooms );
  }

  ////////////////////////////////////////////////////////////////////////////////
  // private methods

  async #findChatworkTab() {
    return await ChromeExtension.shared.findTab('https://www.chatwork.com/');
  }

  async #sendMessageToChatwork(payload) {
    let tab = await this.#findChatworkTab();
    return await ChromeExtension.shared.sendMessageToTab(tab, payload);
  }

  #refreshRoomSelect(rooms) {
    let options = rooms.map( r => { return { value: r.url, text: r.name }; } );
    DomUtil.reloadSelct( this.#roomsSelect, options  );
  }
}

(() => {
let popup = new Popup();
popup.attach(document);
})();

