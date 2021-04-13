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
  async attach(doc) {
    let chatworkTab = await ChromeExtension.shared.findChatworkTab();
    if( !chatworkTab ) {
      let messageArea = doc.getElementById('message-area');
      messageArea.classList.remove('hidden');
      return;
    }
    doc.getElementById('main-area').classList.remove('hidden');
    this.#textarea = doc.getElementById('text');
    this.#getRoomsButton = doc.getElementById('get-rooms-button');
    this.#roomsSelect = doc.getElementById('rooms-select');

    // 各種設定を行う
    this.#getRoomsButton.addEventListener('click', () => this.getRoomNames() );
    this.#roomsSelect.addEventListener('change', (event) => this.#changedRoom(event) );
    doc.getElementById('send-text-button').addEventListener('click', () => this.sendTextToRoom());

    // 表示中のページの情報を取得する
    this.#setTextFromActiveTab();

    await this.getRoomNames();
    this.#restoreSelectedRoom();
  }

  /** テキストを選択されているRoomに投稿する */
  async sendTextToRoom() {
    try {
      if( !this.#selectedRoom ) {
         return;
      }
      let message = {
        type: 'send-text-to-room',
        roomUrl: this.#selectedRoom.value,
        text: this.#textarea.value.trim()
      };
      await this.#sendMessageToChatwork(message);
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  /** ルーム一覧を取得してselectを更新する */
  async getRoomNames() {
    try {
      let res = await this.#sendMessageToChatwork({ type: 'get-room-names' });
      this.#refreshRoomSelect( res.rooms );
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // event handler

  /** ルーム一覧のselectが変更された */
  #changedRoom(event) {
    this.#saveSelectedRoom();
  }
 
  ////////////////////////////////////////////////////////////////////////////////
  // private methods

  get #selectedRoom() {
    return DomUtil.getSelectedOption( this.#roomsSelect );
  }

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

  ////////////////////////////////////////////////////////////////////////////////
  // for storage

  #saveSelectedRoom() {
    chrome.storage.local.set({selected_room: this.#selectedRoom.value});
  }

  #restoreSelectedRoom() {
    chrome.storage.local.get(['selected_room'], (result) => {
      if( chrome.runtime.lastError ) {
        console.log(chrome.runtime.lastError);
        return;
      }
      DomUtil.selectOptionByValue( this.#roomsSelect, result['selected_room'] );
    });
  }
}

(() => {
let popup = new Popup();
popup.attach(document);
})();

