import { viewer_ids } from "./viewer";

export function setup_tabs(pre: HTMLPreElement) {
  // ids
  const i = {
    tabs: "tabs",
    json: "tab-json",
    raw: "tab-raw",
    opts: "tab-opts",
  };
  // classes
  const c = {
    active: "active",
  };

  const native_formatter = document.querySelector<HTMLPreElement>(
    "body > div.json-formatter-container",
  );

  const json = document.createElement("button");
  json.setAttribute("id", i.json);
  json.textContent = "JSON";
  json.classList.add(c.active);

  const raw = document.createElement("button");
  raw.setAttribute("id", i.raw);
  raw.textContent = "Raw Data";

  // const opts = document.createElement("button");
  // opts.setAttribute("id", i.opts);
  // opts.textContent = "Settings";

  const tabs = document.createElement("div");
  tabs.setAttribute("id", i.tabs);
  // tabs.append(json, raw, opts);
  tabs.append(json, raw);

  document.body.prepend(tabs);

  const wrapper = document.querySelector<HTMLDivElement>(
    "#" + viewer_ids.viewer,
  )!;

  json.addEventListener("click", () => {
    // console.log("JSON");
    json.classList.add(c.active);
    raw.classList.remove(c.active);

    wrapper.style.display = "";
    pre.style.display = "none";
    native_formatter && (native_formatter.style.display = "none");
  });

  raw.addEventListener("click", () => {
    // console.log("Raw");
    raw.classList.add(c.active);
    json.classList.remove(c.active);

    wrapper.style.display = "none";
    pre.style.display = "";
    native_formatter && (native_formatter.style.display = "");
  });

  // opts.addEventListener("click", () => {
  //   // console.log("opts");
  //   if (chrome.runtime.openOptionsPage) {
  //     chrome.runtime.openOptionsPage();
  //   } else {
  //     window.open(chrome.runtime.getURL("options.html"));
  //   }
  // });
}
