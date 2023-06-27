import init, { generate_HTML, get_path, handle_keymaps } from "json-in-details";
import {
  content_copy,
  copy_all,
  done,
  file_download,
  unfold_less,
  unfold_more,
} from "./icons";
import { save_as_file } from "./save_as_file";

const { collapse, expand, filter } = init("#jid");
// console.log("viewer");

const i = {
  viewer: "viewer",

  jid: "jid",

  filter: "filter",
  collapse: "collapse",
  expand: "expand",
  save: "save",
  copy_json: "copy_json",

  path: "path",
  copy_path: "copy_path",
};

export { i as viewer_ids };

let opts = {
  theme: "auto", // 'light' | 'dark'
  json_str_max_length: 5000000,
  sticky_panel: 2,
  clickable_link: 1,
  show_newline_chars: false,
  escape_HTML: true,
  keymaps: true,
};

export async function setup_viewer(pre: HTMLPreElement) {
  // console.log({ opts });
  if (import.meta.env.PROD) {
    // @ts-ignore
    opts = await chrome.storage.local.get(opts);
    // console.log({ my_opts: opts });
  }

  if (pre.textContent!.length > opts.json_str_max_length) {
    throw new Error(
      `Too long: ${pre.textContent!.length} > ${opts.json_str_max_length}`
    );
  }

  const data = JSON.parse(pre.textContent!);

  const generated_json_nodes = generate_HTML(data, {
    // @ts-ignore
    clickable_link: opts.clickable_link,
    escape_HTML: opts.escape_HTML,
    show_newline_chars: opts.show_newline_chars,
  });

  let path = "$";
  const theme = get_theme(opts.theme);
  document.documentElement.classList.add(theme);

  const viewer = document.createElement("div");
  viewer.setAttribute("id", i.viewer);

  viewer.innerHTML = `
<div id="filter-panel" class="${opts.sticky_panel == 1 ? "sticky" : ""}">
  <input type="text" id="${i.filter}" placeholder="Filter :" />

  <div id="btns">
    <button id="${i.collapse}" title="Collapse">
      ${unfold_less}
    </button>
    <button id="${i.expand}" title="Expand">
      ${unfold_more}
    </button>
    <button id="${i.copy_json}" title="Copy JSON">
      ${copy_all}
    </button>
    <button id="${i.save}" title="Save">
      ${file_download}
    </button>
  </div>
</div>

<div id="path-panel" class="${opts.sticky_panel == 2 ? "sticky" : ""}">
  <span id="${i.path}" title="path">${path}</span>
  <button id="${i.copy_path}" title="Copy path">
    ${content_copy}
  </button>
</div>

<div id="${i.jid}" class="jid ${theme}">
  ${generated_json_nodes}
</div>
`;

  document.body.append(viewer);

  document.querySelector<HTMLElement>("#jid > details > summary")?.focus();

  btn(i.collapse).addEventListener("click", () => {
    // console.log("collapse");
    collapse();
  });

  btn(i.expand).addEventListener("click", () => {
    // console.log("expand");
    expand();
  });

  const timeout = 750;
  const copy_path = btn(i.copy_path);
  copy_path.addEventListener("click", () => {
    // console.log("copy path: " + path);
    copy2clipboard(path).then(() => {
      copy_path.innerHTML = done;
      setTimeout(() => (copy_path.innerHTML = content_copy), timeout);
    });
  });

  const copy_json = btn(i.copy_json);
  copy_json.addEventListener("click", () => {
    // console.log("copy json");
    copy2clipboard(pre.textContent!).then(() => {
      copy_json.innerHTML = done;
      setTimeout(() => (copy_json.innerHTML = copy_all), timeout);
    });
  });

  btn(i.save).addEventListener("click", () => {
    // console.log("save");
    let file_name = "";

    try {
      // @ts-ignore
      file_name = window.location.pathname.split("/").at(-1);
    } catch (error) {
      console.error(error);
    }

    file_name ||= "data";

    // console.log(route);
    save_as_file(file_name + ".json", pre.textContent!);
  });

  document
    .querySelector<HTMLInputElement>(`#${i.filter}`)!
    .addEventListener("input", (ev) => {
      // console.log("input :");
      // @ts-ignore
      const v = ev.target.value;
      // console.log(v);
      filter(v);
    });

  const el_path = document.querySelector<HTMLSpanElement>(`#${i.path}`)!;

  const jid = document.querySelector<HTMLDivElement>(`#${i.jid}`)!;
  jid.addEventListener("focusin", (ev) => {
    // console.log("focusin :");
    path = get_path(ev);
    // console.log(path);
    el_path.textContent = path;
  });

  if (opts.keymaps) {
    jid.addEventListener("keydown", (ev) => {
      // console.log("keydown");

      if (ev.key === "y") {
        if (ev.target instanceof HTMLElement) {
          // console.log(ev);

          let node_text = "";
          if (ev.target.tagName === "SUMMARY") {
            node_text = ev.target.parentElement!.innerText;
          } else {
            node_text = ev.target!.innerText;
          }
          node_text = node_text.replace(/,$/, "");

          // console.log(text);
          copy2clipboard(node_text);
        }

        return;
      }

      if (ev.key === "p") {
        copy_path.click();
        return;
      }

      handle_keymaps(ev);
    });
  }
}

function btn(id: string) {
  return document.querySelector<HTMLButtonElement>(`#${id}`)!;
}

function copy2clipboard(text: string) {
  return (
    navigator.clipboard
      .writeText(text)
      // .then(() => console.log("copied !"))
      .catch((err) => {
        console.error(err);
      })
  );
}

function get_theme(val: string) {
  if (val === "light" || val === "dark") {
    return val;
  }

  let theme = "light";

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    theme = "dark";
  }

  return theme;
}
