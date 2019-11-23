let saveBtn = document.getElementById("saveSession");

chrome.storage.sync.get("SessionSaverSessions", data => {
  let sessionStore = data["SessionSaverSessions"];
  let savedSessionsSection = document.getElementById("savedSessions");
  if (sessionStore) {
    Object.keys(sessionStore).forEach(entry => {
      node = document.createElement("li");
      text = document.createTextNode(entry);
      node.appendChild(text);
      savedSessionsSection.appendChild(node);
    });
  }
});

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
  let savedSessionsSection = document.getElementById("savedSessions");
  let node = document.createElement("li");
  let text = document.createTextNode(name);
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
      function() {
        node.appendChild(text);
        savedSessionsSection.appendChild(node);
      }
    );
  });
};
