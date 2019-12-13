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
      node = createLiNode(sessionStore[entry].name, entry);
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
  let timestamp = Date.now();
  let node = createLiNode(name, timestamp);
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

function createLiNode(value, sessionId) {
  node = document.createElement("li");
  text = document.createTextNode(value);
  outerDiv = document.createElement("div");
  outerDiv.appendChild(text);
  outerDiv.setAttribute("class", "session");

  optContainerNode = document.createElement("div");
  optContainerNode.setAttribute("class", "options");

  options.forEach(opt => {
    optNode = document.createElement("a");
    textNode = document.createTextNode(opt);
    optNode.appendChild(textNode);
    optNode.setAttribute("class", "option");
    optNode.addEventListener(
      "click",
      function() {
        if (this.opt === "Restore") {
          Restore(this.sessionId);
        } else if (this.opt === "Delete") {
          Delete(this.sessionId);
        }
      }.bind({ sessionId, opt }),
      false
    );
    optContainerNode.appendChild(optNode);
  });

  outerDiv.appendChild(optContainerNode);
  node.appendChild(outerDiv);
  node.setAttribute("data-session-id", sessionId);

  return node;
}

// TODO: keep track of open session maybe?
function Restore(sessionId) {
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
    chrome.windows.create({ url: sessionStore[sessionId].urls }, window => {
      console.log(window);
    });
  });
}

function Delete(sessionId) {
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
    delete sessionStore[sessionId];
    chrome.storage.sync.set({
      SessionSaverSessions: sessionStore
    });
  });
}
