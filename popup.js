let saveBtn = document.getElementById("saveSession");

saveBtn.onclick = () => {
  let sessionName = getSessionName();
  chrome.tabs.query({ currentWindow: true }, tabs => {
    let tabUrls = tabs.map(tab => tab.url);
    console.log(tabUrls);
    console.log(sessionName);
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
