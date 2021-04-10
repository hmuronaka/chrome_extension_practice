(() => {
  let receiver = new MessageReceiver(
    {
      'send-text-to-room': ChatSendCommand,
      'get-room-name': GetRoomNameCommand,
      'get-rooms-name': GetRoomNamesCommand,
      'select-room': SelectRoomCommand
    }
  );
  receiver.run();
})();
