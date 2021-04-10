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
    return {
      roomId: room.id,
      roomName: room.name
    }
  }
}

/**
 * ルーム一覧情報を取得する
 */ 
class GetRoomNamesCommand {
  /**
   * msg: {
   *  type: 'get-rooms-name'
   * }
   */ 
  run(msg) {
    let roomList = new RoomList(document.getElementById('_roomListArea'));
    let rooms = roomList.rooms().map ( r => r.asObject );
    return {
      rooms: rooms
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

