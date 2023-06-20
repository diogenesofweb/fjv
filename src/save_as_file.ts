// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
export function save_as_file(filename: string, data: BlobPart) {
  const blob = new Blob([data], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
}
