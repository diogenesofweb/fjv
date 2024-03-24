import "./style.css";
import { setup_viewer } from "./viewer";
import { setup_tabs } from "./tabs";
import { setup_converting } from "./converting";
import { setup_srceenshot } from "./screenshot";

async function run() {
  // const d1 = performance.now();
  if (import.meta.env.PROD) {
    let elems = 1
    const native_formatter = document.querySelector<HTMLPreElement>(
      "body > div.json-formatter-container",
    );
    if (native_formatter) {
      elems++
      native_formatter.style.display = "none";
    }
    const bodyChildren = document.body.children.length;
    if (bodyChildren !== elems) return "No JSON page";
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

    setup_srceenshot();

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
