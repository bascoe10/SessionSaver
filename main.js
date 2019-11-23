// registering a listener after installing the extension
chrome.runtime.onInstalled.addListener(function() {
  //specify when popup is shown
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher()],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
