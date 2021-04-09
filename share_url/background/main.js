(() => {
  let receiver = new MessageReceiver(
    {
      'share-web-page': ShareWebPageCommand,
      '*': BypassCommand
    }
  );
  receiver.run();
})();
