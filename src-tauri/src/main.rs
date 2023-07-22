// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unknown_lints)]
#![allow(clippy::uninlined_format_args)]

use sys_locale::get_locale;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![current_locale])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn current_locale() -> Option<String> {
    return get_locale();
}

// TODO: get user's preferred language: https://crates.io/crates/accept-language

// TODO: get user's timezone: https://crates.io/crates/timezone-enum

// TODO: get users name from system: https://crates.io/crates/whoami
