const saveBtn = document.getElementById("saveSession");
const options = ["Restore", "Delete"];
let nextSessionIndex = 1;

chrome.storage.sync.get("SessionSaverSessions", data => {
  let sessionStore = data["SessionSaverSessions"];
  let savedSessionsSection = document.getElementById("savedSessions");
  let keys = [];

  if (sessionStore) {
    keys = Object.keys(sessionStore);
    nextSessionIndex = keys.length + 1;

    keys.forEach(entry => {
      node = createLiNode(sessionStore[entry].name);
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

function getSessionName() {
  let defaultName = getDefaultSessionName();
  let sessionName = prompt("Enter Name", defaultName) || defaultName;
  return sessionName;
}

function getDefaultSessionName() {
  return `Session - ${nextSessionIndex}`;
}

function storeSession(name, urls) {
  let savedSessionsSection = document.getElementById("savedSessions");
  let node = createLiNode(name);
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
    let timestamp = Date.now();
    if (!sessionStore) {
      sessionStore = {};
    }

    sessionStore[timestamp] = { name, timestamp, urls };
    chrome.storage.sync.set(
      {
        SessionSaverSessions: sessionStore
      },
      function() {
        savedSessionsSection.appendChild(node);
        nextSessionIndex += 1;
      }
    );
  });
}

function createLiNode(value) {
  node = document.createElement("li");
  text = document.createTextNode(value);
  node.appendChild(text);
  node.setAttribute("class", "session");

  options.forEach(opt => {
    optNode = document.createElement("a");
    textNode = document.createTextNode(opt);
    optNode.appendChild(textNode);
    optNode.setAttribute("class", "option");

    node.appendChild(optNode);
  });

  return node;
}
