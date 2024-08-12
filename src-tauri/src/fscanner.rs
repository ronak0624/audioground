use glob::glob;
use std::path::Path;

pub fn dir(dir: &str, extensions: String) -> Result<Vec<String>, String> {
    // Check if the directory exists
    if !Path::new(&dir).exists() {
        return Err(format!("Directory does not exist: {}", dir));
    }

    // Parse the extensions from the string
    let extensions: Vec<&str> = extensions.split(',').collect();
    let mut matching_files = Vec::new();

    for ext in extensions {
        let pattern = format!("{}/**/*.{}", dir, ext.trim_start_matches('.'));
        match glob(&pattern) {
            Ok(paths) => {
                for path in paths {
                    match path {
                        Ok(p) => matching_files.push(p.display().to_string()),
                        Err(e) => return Err(format!("Error reading path: {}", e)),
                    }
                }
            }
            Err(e) => return Err(format!("Error with glob pattern: {}", e)),
        }
    }

    Ok(matching_files)
}

#[test]
fn is_success() {
    let result = dir("mocks", "mp3".to_string());
    assert_eq!(result.is_ok(), true);
}

#[test]
fn has_correct_len() {
    let result = dir("mocks", "mp3".to_string()).unwrap();
    assert_eq!(result.len() == 1, true);
}
