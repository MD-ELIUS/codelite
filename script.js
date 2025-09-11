
 // CodeMirror options
    const editorOptions = {
      theme: "dracula",
      lineNumbers: true,
      lineWrapping: true,
      viewportMargin: Infinity
    };

    const htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
      ...editorOptions,
      mode: "htmlmixed",
      value: `<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is my mini editor</p>
</body>
</html>`
    });

    const cssEditor = CodeMirror(document.getElementById("cssEditor"), {
      ...editorOptions,
      mode: "css",
      value: `body { background: lightyellow; font-family: sans-serif; }
h1 { color: darkblue; }`
    });

    const editor = CodeMirror(document.getElementById("editor"), {
      ...editorOptions,
      mode: "javascript",
      value: `console.log("Hello World!");`
    });

    // Copy code function
    function copyCode(cmInstance, btnEl) {
      navigator.clipboard.writeText(cmInstance.getValue()).then(() => {
        const original = btnEl.innerHTML;
        btnEl.innerHTML = '<span class="text-gray-700 hover:text-white text-sm">Copied!</span>';
        setTimeout(() => btnEl.innerHTML = original, 1500);
      });
    }

    // Download file
    function downloadFile(content, defaultName) { 
      const a = document.createElement('a'); 
      a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); 
      a.download = defaultName; 
      a.click(); 
      URL.revokeObjectURL(a.href);
    }


    // Download ZIP
    function downloadZip(){
      const zipName = "mini-editor.zip";
      const zip = new JSZip();
      zip.file("index.html", htmlEditor.getValue());
      zip.file("style.css", cssEditor.getValue());
      zip.file("script.js", editor.getValue());
      zip.generateAsync({ type: "blob" }).then(content => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = zipName;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    // Live preview window
    let previewWindow = null;
    function runCode(){
      if(!previewWindow || previewWindow.closed){
        previewWindow = window.open("", "_blank");
      }
      updatePreview();
    }

    // Update preview
    function updatePreview(){
      if(!previewWindow || previewWindow.closed) return;
      const html = htmlEditor.getValue();
      const css = `<style>${cssEditor.getValue()}</style>`;
      const js = editor.getValue();

      previewWindow.document.open();
      previewWindow.document.write(html.replace("</head>", css + "</head>") + `<script>
        try{${js}}catch(e){console.error(e);}
      <\/script>`);
      previewWindow.document.close();
    }

    // Auto-scroll cursor and live update
    [htmlEditor, cssEditor, editor].forEach(cm => {
      cm.on("change", updatePreview);
      cm.on("cursorActivity", () => {
        const cursor = cm.getCursor();
        cm.scrollIntoView({ line: cursor.line, ch: cursor.ch }, 30);
      });
    });
  

      let pendingHandler = null;

// Open the filename modal
function openFilenameModal(defaultName, handler) {
  pendingHandler = handler;
  const input = document.getElementById("filenameInput");
  input.value = defaultName || "";
  document.getElementById("filenameModal").classList.remove("hidden");
  setTimeout(() => input.focus(), 50);

  // Optional: allow pressing Enter to confirm
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

// Confirm and call the pending handler
function confirmFilename() {
  if (!pendingHandler) { 
    closeFilenameModal(); 
    return; 
  }
  const name = (document.getElementById("filenameInput").value || "").trim();
  pendingHandler(name || "download.txt"); // Call the handler with the filename
  closeFilenameModal();
}

// Wrap original downloadFile to use modal
const originalDownloadFile = function(content, defaultName) { 
  const a = document.createElement('a'); 
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); 
  a.download = defaultName; 
  a.click(); 
  URL.revokeObjectURL(a.href);
};

function downloadFile(content, defaultName) {
  openFilenameModal(defaultName, (filename) => {
    originalDownloadFile(content, filename);
  });
}

// Wrap original downloadZip to use modal
const originalDownloadZip = function() {
  const zip = new JSZip();
  zip.file("index.html", htmlEditor.getValue());
  zip.file("style.css", cssEditor.getValue());
  zip.file("script.js", editor.getValue());
  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = "mini-editor.zip";
    a.click();
    URL.revokeObjectURL(a.href);
  });
};

function downloadZip() {
  openFilenameModal("mini-editor.zip", (filename) => {
    const zip = new JSZip();
    zip.file("index.html", htmlEditor.getValue());
    zip.file("style.css", cssEditor.getValue());
    zip.file("script.js", editor.getValue());
    zip.generateAsync({ type: "blob" }).then(content => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  });
}

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.feature-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('show');
            }, index * 600);
          });
          obs.unobserve(entry.target); // trigger only once
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(document.querySelector('#features'));


  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });