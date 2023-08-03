import { toJpeg } from "html-to-image";

export function setup_srceenshot() {
  const dialog = document.createElement("dialog");
  dialog.addEventListener("click", function (ev) {
    if (ev.target === this) this.close();
  });
  document.body.prepend(dialog);

  const screenshot = document.createElement("button");
  screenshot.textContent = "Screenshot";

  screenshot.addEventListener("click", async () => {
    try {
      // console.log("screenshot");
      screenshot.disabled = true;
      screenshot.textContent = "Loading ...";
      // needed to textContent update
      await sleep();

      const jid = document.getElementById("jid");
      // console.log(jid);
      if (!jid) {
        throw new Error("#jid not found");
      }

      const bg = getComputedStyle(jid).getPropertyValue("--_bg");
      // console.log({ bg });

      const dataUrl = await toJpeg(jid, { quality: 0.92, backgroundColor: bg });
      download_img(dataUrl);
    } catch (error) {
      console.error(error);
      /** @ts-ignore */
      const msg = error?.message || "Failed to make screenshot";
      dialog.innerHTML = `<div><h2>Error:</h2><p>${msg}</p></div>`;
      dialog.showModal();
    } finally {
      screenshot.textContent = "Screenshot";
      screenshot.disabled = false;
    }
  });

  document.querySelector<HTMLDivElement>("#tabs")!.append(screenshot);
}

function download_img(src: string) {
  const link = document.createElement("a");
  link.download = "json.jpeg";
  link.href = src;
  link.click();
}

export function sleep(ms = 1) {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
}
