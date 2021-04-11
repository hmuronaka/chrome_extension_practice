(() => {
  let receiver = new MessageReceiver(
    {
      'send-text-to-room': SendTextCommand,
      'get-room-members': GetRoomMembersCommand,
      'get-room-name': GetRoomNameCommand,
      'get-room-names': GetRoomNamesCommand,
      'select-room': SelectRoomCommand
    }
  );
  receiver.run();
})();
