/**
 * 現在のRoomのメンバーを取得する
 */ 
class GetRoomMembersCommand {
  async run(msg) {
    let memberDetailTable = new MemberDetailTable(document.getElementById('_memberDetailMember'));
    if( !memberDetailTable ) {
      return;
    }
    await this.#loadMembers()
    return memberDetailTable.members;
  }

  /**
   * ルームメンバーを取得する。
   *
   * ルームメンバーはメンバー一覧の画面を表示しないと取得されないようなので、
   * 画面を表示して閉じる処理を行なって取得する。
   */ 
  async #loadMembers() {
    // ルーム一覧を表示するまで、前回表示したルームの内容が残っているようなので、毎回取得するメンバー詳細を開く
    // TODO classとして定義するか、utilityメソッドとして定義する
    let showMemerDescription = document.querySelector('#roomMemberArea ._showDescription');
    if( !showMemerDescription ) {
      // NOTE マイチャットなどはメンバー一覧を開く表示がない。
      return;
    }
    // メンバー一覧を開く
    showMemerDescription.click();
    // TODO メンバー一覧が取得されるまで待機する
    await sleepMilliseconds(100);
    let closeButton = document.querySelector('._cwDGBase.dialogBase ._cwDGButtonCancel');
    if( closeButton ) {
      // メンバー一覧を閉じる
      closeButton.click();
    }
  }
}

/**
 * chatworkのurlからRoom名を取得するコマンド
 */ 
class GetRoomNameCommand {
  run(msg) {
    let roomList = new RoomList(document.getElementById('_roomListArea'));
    let room = roomList.getRoomByUrl(msg.url);
    if( !room ) {
      throw "room is not found. url: " + msg.url + ", roomId: " + room.id;
    }
    return room;
  }
}

/**
 * ルーム一覧情報を取得する
 */ 
class GetRoomNamesCommand {
  /**
   * msg: {
   *  type: 'get-room-names'
   * }
   */ 
  run(msg) {
    let roomList = new RoomList(document.getElementById('_roomListArea'));
    return { 
      rooms: roomList
    };
  }
}

/**
 * 指定されたroomUrlのルームを選択する
 */ 
class SelectRoomCommand {
  /**
   * msg: {
   *  type: 'select-room',
   *  roomUrl: 'https://chatwork.com/#!rid000000' などroomを特定するURL
   * } 
   */
  run(msg) {
    let roomList = new RoomList(document.getElementById('_roomListArea'));
    let room = roomList.getRoomByUrl(msg.roomUrl);
    room.select();
  }
}

/**
 * 表示されているルームにメッセージを投稿する
 */ 
class SendTextCommand {
  /**
   *  msg: {
   *    type: 'send-text-to-room',
   *    text: 送信本文
   *  };
   */
  run(msg) {
    let chatSendArea = new ChatSendArea(document.getElementById('_chatSendArea'));
    chatSendArea.text += msg.text;
    chatSendArea.send();
  }
}

