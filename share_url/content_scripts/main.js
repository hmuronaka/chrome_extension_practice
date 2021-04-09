(() => {
  let receiver = new MessageReceiver(
    {
      'share-web-page': ChatSendCommand,
      'get-room-name': GetRoomNameCommand,
      'get-rooms-name': GetRoomNamesCommand,
      'select-room': SelectRoomCommand
    }
  );
  receiver.run();
})();
