// JSZip is loaded by index.html from jsDelivr.
// This module performs browser-side IPA inspection and lossless ZIP repacking.
// It does not resign, decrypt, patch, or bypass Apple's code-signing protections.

export class IPAConverter {
  constructor() {
    this.file = null;
    this.zip = null;
    this.info = null;
  }

  async inspect(file) {
    if (!file.name.toLowerCase().endsWith(".ipa")) {
      throw new Error("Please select an .ipa file.");
    }

    if (!window.JSZip) {
      throw new Error("ZIP engine failed to load. Check your internet connection.");
    }

    this.file = file;
    this.zip = await window.JSZip.loadAsync(file);
    const names = Object.keys(this.zip.files).filter((name) => !this.zip.files[name].dir);

    const appPaths = names.filter((name) => /^Payload\/[^/]+\.app(\/|$)/i.test(name));
    const appRoots = [...new Set(appPaths.map((name) => name.match(/^Payload\/[^/]+\.app/i)?.[0]))];

    const plistNames = names.filter((name) => /\/Info\.plist$/i.test(name));
    const executableNames = names.filter((name) => /\/[^/]+$/i.test(name) && name.startsWith("Payload/"));

    this.info = {
      originalName: file.name,
      size: file.size,
      files: names,
      fileCount: names.length,
      appRoots,
      plistNames,
      payloadDetected: names.some((name) => name.toLowerCase().startsWith("payload/")),
      executableCandidates: executableNames.slice(0, 10)
    };

    if (!this.info.payloadDetected) {
      throw new Error("This ZIP does not contain a Payload/ directory, so it does not look like a standard IPA.");
    }

    return this.info;
  }

  async repack() {
    if (!this.zip || !this.file) throw new Error("Choose an IPA first.");

    const output = new JSZip();
    for (const [name, entry] of Object.entries(this.zip.files)) {
      if (entry.dir) {
        output.folder(name);
      } else {
        const data = await entry.async("uint8array");
        output.file(name, data, { binary: true });
      }
    }

    return output.generateAsync({
      type: "blob",
      mimeType: "application/octet-stream",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });
  }

  download(blob) {
    const base = this.file.name.replace(/\.ipa$/i, "");
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${base}-converted.ipa`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
