document.addEventListener('DOMContentLoaded', () => {
  const settingsIcon = document.querySelector('.settings-icon');
  const mainPanel = document.querySelector('.main-panel');
  const settingsPanel = document.querySelector('.settings-panel');
  const dropZone = document.querySelector('.drop-zone');
  const fileInput = document.querySelector('input[type="file"]');
  const apiInput = document.querySelector('.api-input');
  const darkModeToggle = document.querySelector('#darkMode');
  const aiFormattingToggle = document.querySelector('#aiFormatting');
  const spinner = document.querySelector('.spinner');
  const resultText = document.querySelector('.result-text');
  const copyButton = document.querySelector('.copy-button');
  const audioContainer = document.querySelector('.audio-container');

  chrome.storage.sync.get(['apiKey', 'darkMode', 'aiFormatting', 'lastAudioSrc', 'lastText'], (result) => {
    if (result.apiKey) {
      apiInput.value = result.apiKey;
    }
    if (result.darkMode) {
      darkModeToggle.checked = result.darkMode;
      document.body.classList.toggle('dark-mode', result.darkMode);
    }
    if (result.aiFormatting !== undefined) {
      aiFormattingToggle.checked = result.aiFormatting;
    } else {
      aiFormattingToggle.checked = false;
    }
    if (result.lastAudioSrc) {
      displayAudio(result.lastAudioSrc);
    }
    if (result.lastText) {
      resultText.textContent = result.lastText;
      copyButton.style.display = 'block';
    }
  });

  settingsIcon.addEventListener('click', () => {
    mainPanel.style.display = mainPanel.style.display === 'none' ? 'block' : 'none';
    settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
  });

  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
  });

  aiFormattingToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ aiFormatting: aiFormattingToggle.checked });
  });

  apiInput.addEventListener('change', () => {
    chrome.storage.sync.set({ apiKey: apiInput.value });
  });

  function displayAudio(src) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = src;
    audioContainer.innerHTML = '';
    audioContainer.appendChild(audio);
    chrome.storage.sync.set({ lastAudioSrc: src });
  }

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderStyle = 'solid';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderStyle = 'dashed';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderStyle = 'dashed';
    handleFile(e.dataTransfer.files[0]);
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
  });

  function getStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        resolve(result);
      });
    });
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    const apiKeyData = await getStorage('apiKey');
    if (!apiKeyData.apiKey) {
      alert('Please enter your OpenAI API key in settings');
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    displayAudio(audioUrl);

    spinner.style.display = 'block';
    resultText.textContent = '';
    copyButton.style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');

    try {
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeyData.apiKey}`
        },
        body: formData
      });
      const whisperData = await whisperResponse.json();
      const whisperText = whisperData.text;

      const storageData = await getStorage('aiFormatting');
      const aiFormatting = storageData.aiFormatting;
      if (aiFormatting) {
        const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyData.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a text formatter. Format the given text into proper sentences and paragraphs without changing ANY of the words. You may add and change punctuation but do NOT change ANY of the words."
              },
              {
                role: "user",
                content: `Reformat the following text without changing any words:\n\n${whisperText}`
              }
            ]
          })
        });
        const chatData = await chatResponse.json();
        const formattedText = (chatData.choices &&
                               chatData.choices[0] &&
                               chatData.choices[0].message &&
                               chatData.choices[0].message.content)
          ? chatData.choices[0].message.content
          : whisperText;

        resultText.textContent = formattedText;
        chrome.storage.sync.set({ lastText: formattedText });
      } else {
        resultText.textContent = whisperText;
        chrome.storage.sync.set({ lastText: whisperText });
      }
      copyButton.style.display = 'block';
    } catch (error) {
      resultText.textContent = 'Error: Failed to convert audio to text';
    } finally {
      spinner.style.display = 'none';
    }
  }

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(resultText.textContent)
      .then(() => {
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copied!';
        setTimeout(() => { 
          copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy'; 
        }, 2000);
      })
      .catch(() => {
        alert('Failed to copy text.');
      });
  });

});
