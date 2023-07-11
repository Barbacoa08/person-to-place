// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// TODO: get system locale: https://crates.io/crates/sys-locale
// use sys_locale::get_locale;
// let locale = get_locale().unwrap_or_else(|| String::from("en-US"));
// println!("The current locale is {}", locale);

// TODO: get user's preferred language: https://crates.io/crates/accept-language

// TODO: get user's timezone: https://crates.io/crates/timezone-enum

// TODO: get users name from system: https://crates.io/crates/whoami

// TODO: open in last used dimensions: https://crates.io/crates/last-window-position
