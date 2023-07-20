import "./style.css";
import { setup_viewer } from "./viewer";
import { setup_tabs } from "./tabs";
import { setup_converting } from "./converting";

async function run() {
  // const d1 = performance.now();
  if (import.meta.env.PROD) {
    const bodyChildren = document.body.children.length;
    if (bodyChildren !== 1) return "No JSON page";
  }

  const pre = document.querySelector<HTMLPreElement>("body > pre");

  if (!pre) {
    return "No body>pre found";
  }

  const pre_text = pre.textContent;

  if (!pre_text) {
    return "No content in body>pre";
  }

  if (!/^\s*[\{\[]/.test(pre_text)) {
    return "Does not start with { or ]";
  }

  // console.log(json_str);

  try {
    pre.style.display = "none";
    // pre.remove();

    const result = await setup_viewer(pre);

    setup_tabs(pre);

    setup_converting(pre_text, result.data, result.theme);

    if (import.meta.env.PROD) {
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL("style.css");
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    // console.log({ done_in: performance.now() - d1 });

    return "OK";
  } catch (error) {
    pre.style.display = "";
    console.error(error);
    // @ts-ignore
    return error?.message || "Failed to parse";
  }
}
// run().then((v) => console.log(v));
run();
