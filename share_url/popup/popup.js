/**
 * popup.htmlに対応するjs
 */ 
class Popup {

  ////////////////////////////////////////////////////////////////////////////////
  // attributes

  /** 送信本文 */
  #textarea;
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
    this.#textarea = doc.getElementById('text');
    this.#getRoomsButton = doc.getElementById('get-rooms-button');
    this.#roomsSelect = doc.getElementById('rooms-select');

    // 表示中のページの情報を取得する
    this.#getRoomsButton.addEventListener('click', () => this.getRoomsName() );
    this.#setTextFromActiveTab();
    doc.getElementById('send-text-button').addEventListener('click', () => this.sendTextToRoom());
    this.getRoomsName();
  }

  get selectedRoom() {
    if( this.#roomsSelect.selectedIndex < 0 ) {
      return null;
    }
    return this.#roomsSelect.options[this.#roomsSelect.selectedIndex];
  }

  /** テキストを選択されているRoomに投稿する */
  async sendTextToRoom() {
    if( !this.selectedRoom ) {
      return;
    }
    let message = {
      type: 'send-text-to-room',
      roomUrl: this.selectedRoom.value,
      text: this.#textarea.value.trim()
    };
    this.#sendMessageToChatwork(message);
  }

  /** ルーム一覧を取得してselectを更新する */
  async getRoomsName() {
    let res = await this.#sendMessageToChatwork({ type: 'get-rooms-name' });
    this.#refreshRoomSelect( res.rooms );
  }

  ////////////////////////////////////////////////////////////////////////////////
  // private methods

  async #sendMessageToChatwork(message) {
    return await ChromeExtension.shared.sendMessage(message);
  }

  #setTextFromActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (...args) => {
      const [tab] = Array.from(args[0]);
      let text = this.#textFromTab(tab);
      this.#setText(text);
    });
  }

  #refreshRoomSelect(rooms) {
    let options = rooms.map( r => { return { value: r.url, text: r.name }; } );
    DomUtil.reloadSelct( this.#roomsSelect, options  );
  }

  #textFromTab(tab) {
    // 末尾の\n\nは、title/urlに続けてメッセージを入力しやすいように挿入。
    // \n\nが不要な場合を想定して、送信時にtrimで空白を除去している。
    return `${tab.title}\n${tab.url}\n\n`;
  }

  #setText(text) {
    this.#textarea.value = text;
  }
}

(() => {
let popup = new Popup();
popup.attach(document);
})();

