(() => {
  let receiver = new MessageReceiver(
    {
      'send-text-to-room': ShareWebPageCommand,
      '*': BypassCommand
    }
  );
  receiver.run();
})();
