let saveBtn = document.getElementById("saveSession");

saveBtn.onclick = () => {
  let sessionName = getSessionName();
  chrome.tabs.query({ currentWindow: true }, tabs => {
    let tabUrls = tabs.map(tab => tab.url);
    storeSession(sessionName, tabUrls);
  });
};

const getSessionName = () => {
  let defaultName = getDefaultSessionName();
  let sessionName = prompt("Enter Name", defaultName);
  return sessionName;
};

const getDefaultSessionName = () => {
  return `Session @ ${new Date()}`;
};

const storeSession = (name, urls) => {
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
    if (!sessionStore) {
      sessionStore = {};
    }
    sessionStore[name] = urls;
    chrome.storage.sync.set(
      {
        SessionSaverSessions: sessionStore
      },
      function() {}
    );
  });
};
