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
class RoomSelectCommand {
  run(msg) {
    let roomList = new RoomList(document.getElementById('_roomListArea'));
    let room = roomList.getRoomByUrl(msg.roomUrl);
    room.select();
  }
}

/**
 * 表示されているルームにメッセージを投稿する
 */ 
class ChatSendCommand {
  #roomSelectCommand = new RoomSelectCommand();
  run(msg) {
    this.#roomSelectCommand.run(msg);
    setTimeout(() => {
      let chatSendArea = new ChatSendArea(document.getElementById('_chatSendArea'));
      var text = chatSendArea.text;
      text += msg.title + '\n' + msg.url;
      chatSendArea.text = text;
      chatSendArea.send();
    }, 1000);
  }
}

