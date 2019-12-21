const saveBtn = document.getElementById("saveSession");
const options = ["Restore", "Delete"];

chrome.storage.sync.get("SessionSaverSessions", data => {
  let sessionStore = data["SessionSaverSessions"];
  let savedSessionsSection = document.getElementById("savedSessions");
  let keys = [];

  if (sessionStore) {
    keys = Object.keys(sessionStore);

    keys.forEach(entry => {
      node = createLiNode(sessionStore[entry].name, entry);
      savedSessionsSection.appendChild(node);
    });
  }
});

saveBtn.onclick = () => {
  let timestamp = Date.now();
  let sessionName = getSessionName(timestamp);
  chrome.tabs.query({ currentWindow: true }, tabs => {
    let tabUrls = tabs.map(tab => tab.url);
    storeSession(sessionName, tabUrls, timestamp);
  });
};

function getSessionName(timestamp) {
  let defaultName = getDefaultSessionName(timestamp);
  let sessionName = prompt("Enter Name", defaultName) || defaultName;
  return sessionName;
}

function getDefaultSessionName(timestamp) {
  return `Session - ${timestamp}`;
}

function storeSession(name, urls, timestamp) {
  let savedSessionsSection = document.getElementById("savedSessions");
  let node = createLiNode(name, timestamp);
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
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

// TODO: keep track of open session maybe? To prevent duplicate restore
function Restore(sessionId) {
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
    chrome.windows.create({ url: sessionStore[sessionId].urls }, _ => {});
  });
}

function Delete(sessionId) {
  chrome.storage.sync.get("SessionSaverSessions", function(data) {
    let sessionStore = data["SessionSaverSessions"];
    delete sessionStore[sessionId];
    chrome.storage.sync.set(
      {
        SessionSaverSessions: sessionStore
      },
      () => {
        let savedSessionsSection = document.getElementById("savedSessions");
        let nodeToRemove;
        savedSessionsSection.childNodes.forEach(node => {
          if (node.dataset.sessionId == sessionId) {
            nodeToRemove = node;
          }
        });
        if (nodeToRemove) savedSessionsSection.removeChild(nodeToRemove);
      }
    );
  });
}
