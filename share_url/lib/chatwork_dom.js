// ChatworkのページのDOM要素を表現
//
/**
 * メンバー一人分の情報(Row)
 */ 
class MemberDetailRow {
  constructor(el) {
    this.el = el;
  }

  // ユーザー名
  get name() {
    return this.el.querySelector('.roomMemberTable__nameText').innerText.trim();
  }

  // ユーザーID
  get id() {
    return this.el.querySelector('.roomMemberTable__avatar img._avatar').getAttribute('data-aid');
  }

  get asObject() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

/**
 * メンバーテーブルの情報
 * メンバーテーブルの情報は、メンバー一覧画面が表示されるまで、numberOfMembers === 0となるので
 * 注意。
 *
 * またルームのメンバーを取得し後、別のルームを表示した場合、そのルームのメンバー一覧を表示するまで
 * 以前表示したルームのメンバーが保持されるのでこの点も注意
 */ 
class MemberDetailTable {
  constructor(el) {
    this.el = el;
  }

  get members() {
    return [...this.rows].map( (row) => {
      return (new MemberDetailRow(row)).asObject;
    });
  }

  get rows() {
    return this.el.rows;
  }

  get numberOfMembers() {
    return this.rows.length;
  }
}

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

  select() {
    this.el.click();
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


