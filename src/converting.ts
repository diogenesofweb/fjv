import { check, content_copy } from "./icons";
import jsonToGo from "./json-to-go";
import json_to_ts from "json-to-ts";
import { createSchema } from "genson-js";
import { generate_HTML } from "json-in-details";

const b_copy_all = "Copy all";

export function setup_converting(
  json_data_str: string,
  json_data: any,
  theme: string
) {
  // ids
  const i = {
    btns: "convert-btns",
    convert: "convert",
  };

  let is_ts_done = false;
  const ts_dialog = document.createElement("dialog");
  const j2ts = document.createElement("button");
  j2ts.textContent = "Convert JSON to Typescript interfaces";
  j2ts.addEventListener("click", () => {
    convert_dialog.close();
    if (is_ts_done) return ts_dialog.showModal();

    try {
      const res = make_ts(json_data);
      const container = make_code_container(res.code_text, res.code_formatted);
      ts_dialog.append(container);
    } catch (err) {
      const msg = err || "Oups :(";
      ts_dialog.innerHTML = `<div>${msg}</div>`;
    } finally {
      is_ts_done = true;
      ts_dialog.showModal();
    }
  });

  let is_go_done = false;
  const go_dialog = document.createElement("dialog");
  const j2go = document.createElement("button");
  j2go.textContent = "Convert JSON to Go structs";
  j2go.addEventListener("click", () => {
    convert_dialog.close();
    // console.log({ json_str });
    if (is_go_done) return go_dialog.showModal();

    try {
      // const res = make_go("must err");
      const res = make_go(json_data_str);
      const container = make_code_container(res.code_text, res.code_formatted);
      go_dialog.append(container);
    } catch (err) {
      const msg = err || "Oups :(";
      go_dialog.innerHTML = `<div>${msg}</div>`;
    } finally {
      is_go_done = true;
      go_dialog.showModal();
    }
  });

  let is_schema_done = false;
  const schema_dialog = document.createElement("dialog");
  const j2schema = document.createElement("button");
  j2schema.textContent = "Convert JSON to JSON schema";
  j2schema.addEventListener("click", () => {
    convert_dialog.close();
    if (is_schema_done) return schema_dialog.showModal();

    try {
      const schema = createSchema(json_data);
      // console.log(schema);
      const html = generate_HTML(schema, {
        escape_HTML: false,
        clickable_link: 0,
      });
      // console.log(html);

      const container = document.createElement("div");
      container.innerHTML = `<div class="jid ${theme}">${html}</div>`;

      const b = document.createElement("button");
      b.classList.add("copy-all");
      b.textContent = b_copy_all;
      b.addEventListener("click", () =>
        copy2clipboard(b, JSON.stringify(schema, null, 2))
      );
      container.prepend(b);

      schema_dialog.append(container);
    } catch (err) {
      const msg = err || "Oups :(";
      schema_dialog.innerHTML = `<div>${msg}</div>`;
    } finally {
      is_schema_done = true;
      schema_dialog.showModal();
    }
  });

  const convert_dialog = document.createElement("dialog");
  const dialogs = [convert_dialog, ts_dialog, schema_dialog, go_dialog];
  dialogs.forEach((el) => {
    el.addEventListener("click", function (ev) {
      if (ev.target === this) this.close();
    });
  });

  const convert_btns = document.createElement("div");
  convert_btns.setAttribute("id", i.btns);
  convert_btns.append(j2schema, j2ts, j2go);
  convert_dialog.append(convert_btns);

  document.body.prepend(...dialogs);

  const convert = document.createElement("button");
  convert.setAttribute("id", i.convert);
  convert.textContent = "Convert";
  convert.addEventListener("click", () => {
    // console.log("convert");
    convert_dialog.showModal();
  });
  // document.body.prepend(convert);
  document.querySelector<HTMLDivElement>("#tabs")!.append(convert);
}

function make_go(json_str: string) {
  const result = jsonToGo(json_str);
  // console.log(res);

  if (result.error) throw result.error;

  const code_text = result.go;

  const sep0 = "type ";

  const code_formatted = code_text
    .split(sep0)
    .filter(Boolean)
    .map((v) => {
      // console.log(v);
      const sep1 = "/n";
      const block = v
        .split(sep1)
        .map((el) => {
          // return el;
          const sep2 = "\n\t";
          return el
            .split(sep2)
            .map((x, i) => {
              const s = x.split(" ");

              if (s.length === 3) {
                if (i === 0) {
                  return `${s[0]} <b>${s[1]}</b> ${s[2]}`;
                }
                return `${s[0]} <b>${s[1]}</b> <span>${s[2]}</span>`;
              } else {
                return el;
              }
            })
            .join(sep2)
            .replace("{", "<span>{</span>");
        })
        .join(sep1);

      // return block;
      return `<b>${sep0}</b>` + block;
    });

  return { code_text, code_formatted };
}

function make_ts(json: any) {
  // console.log({ json });
  const vals = json_to_ts(json);
  const code_text = vals.reduce((c, p) => c + "\n\n" + p, "");
  // console.log(vals);
  const code_formatted = vals.map((v) => {
    const sep = "\n";
    return v
      .split(sep)
      .map((el, i) => {
        if (i === 0) {
          const s = el.split("interface");
          return `<b>interface</b>${s[1]}`;
        }

        const s = el.split(": ");
        if (s.length === 2) {
          return `<span>${s[0]}</span>: ${s[1]}`;
        } else {
          return el;
        }
      })
      .join(sep);
  });

  return { code_text, code_formatted };
}

function make_code_container(code_text: string, code_formatted: string[]) {
  const b = document.createElement("button");
  b.classList.add("copy-all");
  b.textContent = b_copy_all;
  b.addEventListener("click", () => copy2clipboard(b, code_text));

  const container = document.createElement("div");
  container.append(b);

  // console.log(res);
  code_formatted.forEach((el) => {
    const block = document.createElement("div");
    block.classList.add("code-block");
    block.innerHTML = `<pre>${el}</pre>`;

    const btn = document.createElement("button");
    btn.innerHTML = content_copy;
    btn.setAttribute("title", "copy code block");
    btn.addEventListener("click", copy_code_block);
    block.append(btn);

    container.append(block);
  });

  return container;
}

async function copy2clipboard(elem: HTMLButtonElement, text: string) {
  try {
    await navigator.clipboard.writeText(text);
    elem.textContent = "Copied !";
    setTimeout(() => (elem.textContent = b_copy_all), 1000);
  } catch (err) {
    console.error(err);
  }
}

function copy_code_block(ev: MouseEvent) {
  const elem = ev.currentTarget;
  const ok = elem instanceof HTMLElement;
  if (!ok) return;

  const text = elem.previousElementSibling?.textContent;
  if (!text) return console.warn("where is my text?");
  // console.log(text);

  navigator.clipboard
    .writeText(text)
    .then(() => {
      elem.innerHTML = check;
      setTimeout(() => (elem.innerHTML = content_copy), 1000);
    })
    .catch((err) => {
      console.error(err);
    });
}
