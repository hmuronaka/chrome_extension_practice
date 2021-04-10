(() => {
  let receiver = new MessageReceiver(
    {
      'send-text-to-room': SendTextCommand,
      '*': BypassCommand
    }
  );
  receiver.run();
})();
