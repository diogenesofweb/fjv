// Saves options to chrome.storage
const saveOptions = () => {
  const theme = document.getElementById("theme").value;

  const sticky_panel = +document.getElementById("sticky_panel").value;
  const clickable_link = +document.getElementById("clickable_link").value;
  const json_str_max_length = +document.getElementById("json_str_max_length")
    .value;

  const keymaps = document.getElementById("keymaps").checked;
  const escape_HTML = document.getElementById("escape_HTML").checked;
  const show_newline_chars =
    document.getElementById("show_newline_chars").checked;

  const opts = {
    json_str_max_length,
    clickable_link,
    show_newline_chars,
    escape_HTML,
    keymaps,
    sticky_panel,
    theme,
  };
  // console.log(opts);
  chrome.storage.local.set(opts, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(
    {
      theme: "auto",
      json_str_max_length: 5000000,
      sticky_panel: 2,
      clickable_link: 1,
      show_newline_chars: false,
      escape_HTML: true,
      keymaps: true,
    },
    (items) => {
      // console.log(items);

      document.getElementById("theme").value = items.theme;
      document.getElementById("sticky_panel").value = items.sticky_panel;
      document.getElementById("clickable_link").value = items.clickable_link;
      document.getElementById("json_str_max_length").value =
        items.json_str_max_length;

      document.getElementById("keymaps").checked = items.keymaps;
      document.getElementById("escape_HTML").checked = items.escape_HTML;
      document.getElementById("show_newline_chars").checked =
        items.show_newline_chars;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
