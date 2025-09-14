 const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Initialize CodeMirror
    const editor = CodeMirror(document.getElementById("editor"), {
      mode: "javascript",
      theme: "dracula",
      lineNumbers: true,
      value: `// Try writing code
console.log("Hello, CodeLite!");
let x = 5;
console.warn("Be careful, x is", x);
console.log("x * 2 =", x * 2);
throw new Error("Test error!");`
    });

    const consoleDiv = document.getElementById("console");

    // Print messages
    function customLog(message, type="log") {
      const line = document.createElement("div");
      const time = new Date().toLocaleTimeString();
      line.className = {
        log: "text-blue-300",
        warn: "text-yellow-300",
        error: "text-red-400 whitespace-pre-wrap"
      }[type] || "text-gray-200";
      line.textContent = (type === "error") ? message : `[${time}] ${message}`;
      consoleDiv.appendChild(line);
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

// Override console
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args); // still print in browser console
  args.forEach(arg => {
    let output = (typeof arg === "object") ? JSON.stringify(arg, null, 2) : arg;
    customLog(output, "log");
  });
};

const originalWarn = console.warn;
console.warn = (...args) => {
  originalWarn(...args);
  args.forEach(arg => {
    let output = (typeof arg === "object") ? JSON.stringify(arg, null, 2) : arg;
    customLog(output, "warn");
  });
};

const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  args.forEach(arg => {
    let output = (typeof arg === "object") ? JSON.stringify(arg, null, 2) : arg;
    customLog(output, "error");
  });
};

    // Run code
    function runCode() {
      consoleDiv.innerHTML = ""; // clear console
      try {
        new Function(editor.getValue())();
      } catch (err) {
        customLog(err.message, "error");
        if (err.stack) {
          err.stack.split("\n").forEach(line => {
            customLog(line.trim(), "error");
          });
        }
      }
    }

    // Clear console manually
    function clearConsole() {
      consoleDiv.innerHTML = "";
    }



    // Copy code function
function copyCode(cmInstance, btnEl) {
  navigator.clipboard.writeText(cmInstance.getValue()).then(() => {
    const original = btnEl.innerHTML;
    btnEl.innerHTML = '<span class="text-gray-700 hover:text-white text-sm">Copied!</span>';
    setTimeout(() => btnEl.innerHTML = original, 1500);
  });
}

// Download file function
function downloadFile(content, defaultName) { 
  const a = document.createElement('a'); 
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); 
  a.download = defaultName; 
  a.click(); 
  URL.revokeObjectURL(a.href);
}


let pendingHandler = null;

// Open the filename modal
function openFilenameModal(defaultName, handler) {
  pendingHandler = handler;
  const input = document.getElementById("filenameInput");
  input.value = defaultName || "script.js";
  document.getElementById("filenameModal").classList.remove("hidden");
  setTimeout(() => input.focus(), 50);

  input.onkeypress = function(e) {
    if (e.key === "Enter") confirmFilename();
  };
}

// Close modal
function closeFilenameModal() {
  document.getElementById("filenameModal").classList.add("hidden");
  pendingHandler = null;
  document.getElementById("filenameInput").onkeypress = null;
}

// Confirm filename and download
function confirmFilename() {
  if (!pendingHandler) { 
    closeFilenameModal(); 
    return; 
  }
  const name = (document.getElementById("filenameInput").value || "").trim();
  pendingHandler(name || "script.js");
  closeFilenameModal();
}

// Wrap original download to use modal
const originalDownloadFile = function(content, defaultName) { 
  const a = document.createElement('a'); 
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); 
  a.download = defaultName; 
  a.click(); 
  URL.revokeObjectURL(a.href);
};

// New downloadFile function
function downloadFile(content, defaultName) {
  openFilenameModal(defaultName, (filename) => {
    originalDownloadFile(content, filename);
  });
}
