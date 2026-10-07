export class UI {
  constructor() {
    this.input = document.querySelector("#ipaInput");
    this.dropzone = document.querySelector("#dropzone");
    this.statusEl = document.querySelector("#status");
    this.downloadBtn = document.querySelector("#downloadBtn");
    this.fileMeta = document.querySelector("#fileMeta");
    this.fileList = document.querySelector("#fileList");
    this.downloadHandler = null;
  }

  bind({ onFile, onDownload }) {
    this.downloadHandler = onDownload;
    this.input.addEventListener("change", () => onFile(this.input.files[0]));

    this.downloadBtn.addEventListener("click", onDownload);

    ["dragenter", "dragover"].forEach((eventName) => {
      this.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        this.dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        this.dropzone.classList.remove("dragover");
      });
    });

    this.dropzone.addEventListener("drop", (event) => {
      const file = [...event.dataTransfer.files][0];
      if (file) onFile(file);
    });
  }

  reset() {
    this.fileMeta.innerHTML = "";
    this.fileList.innerHTML = "";
    this.enableDownload(false);
  }

  showInfo(info) {
    const items = [
      ["File", info.originalName],
      ["Size", this.formatBytes(info.size)],
      ["Archive entries", String(info.fileCount)],
      ["App bundle", info.appRoots.join(", ") || "Not detected"]
    ];

    this.fileMeta.innerHTML = items.map(([label, value]) => `
      <div class="meta-item">
        <span class="meta-label">${this.escape(label)}</span>
        ${this.escape(value)}
      </div>
    `).join("");

    this.fileList.innerHTML = info.files.slice(0, 150).map((name) =>
      `<li>${this.escape(name)}</li>`
    ).join("");

    if (info.files.length > 150) {
      this.fileList.insertAdjacentHTML("beforeend",
        `<li>…and ${info.files.length - 150} more entries</li>`
      );
    }
  }

  enableDownload(enabled) {
    this.downloadBtn.disabled = !enabled;
  }

  status(message, type = "") {
    this.statusEl.textContent = message;
    this.statusEl.className = `status ${type}`;
  }

  formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 2 : 0)} ${units[i]}`;
  }

  escape(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    }[char]));
  }
}
