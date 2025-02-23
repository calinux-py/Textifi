chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    darkMode: false,
    lastAudioSrc: null,
    lastText: null
  });
});