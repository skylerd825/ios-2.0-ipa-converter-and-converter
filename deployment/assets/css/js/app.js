import { IPAConverter } from "../../conversion/modules/converter.js";
import { UI } from "../../conversion/modules/ui.js";

const converter = new IPAConverter();
const ui = new UI();

ui.bind({
  onFile: async (file) => {
    ui.reset();
    if (!file) return;

    try {
      ui.status("Reading IPA archive…");
      const info = await converter.inspect(file);
      ui.showInfo(info);
      ui.status(`Ready: ${file.name}`, "success");
      ui.enableDownload(true);
    } catch (error) {
      ui.status(error.message || "Could not read the IPA.", "error");
      ui.enableDownload(false);
    }
  },
  onDownload: async () => {
    try {
      ui.status("Building downloadable IPA…");
      const blob = await converter.repack();
      converter.download(blob);
      ui.status("Download started.", "success");
    } catch (error) {
      ui.status(error.message || "Could not create the download.", "error");
    }
  }
});
