// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod fscanner;
mod metaprobe;

use fix_path_env;
use serde_json::to_string;
use tauri::Manager;
#[cfg(target_os = "windows")]
use window_vibrancy::apply_mica;
#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[tauri::command]
fn ls(dir: &str, extensions: String) -> Result<Vec<String>, String> {
    match fscanner::dir(dir, extensions) {
        Ok(files) => Ok(files),
        Err(err) => Err(format!("{:?}", err)),
    }
}

#[tauri::command]
async fn probe(path: String) -> Result<String, String> {
    match metaprobe::get_tags(&path) {
        Ok(info) => {
            // Use Debug to format the info as a string
            to_string(&info).map_err(|e| format!("Serialization error: {:?}", e))
        }
        Err(err) => Err(format!("Could not analyze file with probe: {:?}", err)),
    }
}

#[tauri::command]
async fn get_album_art(path: String) -> metaprobe::AlbumArt {
    metaprobe::get_album_art(&path)
}

fn main() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(16.0))
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_mica' is only supported on Windows");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![ls, probe, get_album_art])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
