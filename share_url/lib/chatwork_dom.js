// ChatworkのページのDOM要素を表現

/**
 * 1ルームの要素
 */ 
class Room {
  constructor(roomEl) {
    this.el = roomEl;
  }

  get id() {
    return this.el.getAttribute('data-rid');
  }

  get name() {
    return this.el.innerText;
  }

  get url() {
    return `https://chatwork.com/#!rid${this.id}`;
  }

  get asObject() {
    return {
      id: this.id,
      url: this.url,
      name: this.name
    };
  }

}

/**
 * ルーム一覧 
 */ 
class RoomList {
  constructor(roomList) {
    this.el = roomList;
  }

  /**
   * urlに対応するRoomのインスタンスを返す
   */ 
  getRoomByUrl(url) {
    if( !url ) {
      return null;
    }

    let roomId = RoomList.getRoomIdFromUrl(url);
    let roomDiv = this.el.querySelector(`[data-rid="${roomId}"]`);
    if( !roomDiv ) {
      return null;
    }
    return new Room(roomDiv);
  }

  /**
   * urlに対応するRoomのidを返す
   */ 
  static getRoomIdFromUrl(url) {
    let strs = url && url.split('#!rid');
    return strs[strs.length - 1];
  }

  /**
   * Roomオブジェクトの一覧を返す
   */ 
  rooms() {
    let rooms = [...this.el.querySelectorAll('li[role="listitem"]')];
    return rooms.map( r => new Room(r) );
  }
}

/**
 * Chatworkの送信用のテキストエリア
 */ 
class ChatSendArea {
  constructor(el) {
    this.el = el;
    this.chatText = this.el.querySelector('#_chatText');
    this.sendButton = this.el.querySelector('.chatSendArea__chatInput button.chatInput__submit');
  }

  get text() {
    if(!this.chatText) {
      return null;
    }
    return this.chatText.value;
  }

  set text(text) {
    if(!this.chatText) {
      return;
    }
    this.chatText.value = text;
    this.chatText.dispatchEvent(new Event('input', {bubbles: true}));
  }

  send() {
    if(!this.sendButton ) {
      return;
    }
    //this.sendButton.click();
  }
}

