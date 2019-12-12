const saveBtn = document.getElementById("saveSession");
const options = ["Restore", "Delete"];

const createLiNode = value => {
  node = document.createElement("li");
  text = document.createTextNode(value);
  node.appendChild(text);

  options.forEach(opt => {
    optNode = document.createElement("a");
    textNode = document.createTextNode(opt);
    optNode.appendChild(textNode);
    optNode.setAttribute("class", "option");

    node.appendChild(optNode);
  });

  console.log(node);
  return node;
};

chrome.storage.sync.get("SessionSaverSessions", data => {
  let sessionStore = data["SessionSaverSessions"];
  let savedSessionsSection = document.getElementById("savedSessions");
  if (sessionStore) {
    Object.keys(sessionStore).forEach(entry => {
      node = createLiNode(entry);
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
  let node = createLiNode(name);
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
        savedSessionsSection.appendChild(node);
      }
    );
  });
};
