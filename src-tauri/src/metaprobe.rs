use audiotags::{MimeType, Tag};
use serde::Serialize;
use serde_json::{Map, Value};
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize)]
pub struct AlbumArt {
    pub mime_type: String,
    pub data: Vec<u8>,
}

pub fn get_tags(path: &str) -> Result<Value, &str> {
    let filename = Path::new(path)
        .file_name()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();

    let tag_result = Tag::new().read_from_path(path);

    let (title, artist, album, genre, duration, date, comment) = match tag_result {
        Ok(tag) => {
            let title = tag.title().unwrap_or("").to_string();
            let artist = tag.artist().unwrap_or("").to_string();
            let album = tag.album_title().unwrap_or("").to_string();
            let genre = tag.genre().unwrap_or("").to_string();
            let duration = tag.duration().unwrap_or(0.0).to_string();
            let date = tag.date().map_or_else(
                || {
                    let start = SystemTime::now();
                    let since_the_epoch = start.duration_since(UNIX_EPOCH).unwrap();
                    let timestamp = since_the_epoch.as_secs();
                    timestamp.to_string()
                },
                |d| d.to_string(),
            );
            let comment = tag.comment().unwrap_or("").to_string();
            (title, artist, album, genre, duration, date, comment)
        }
        Err(_) => (
            "".to_string(),
            "".to_string(),
            "".to_string(),
            "".to_string(),
            "".to_string(),
            "".to_string(),
            "".to_string(),
        ),
    };

    let mut tags = Map::new();
    tags.insert("duration".to_string(), duration.into());
    tags.insert("genre".to_string(), genre.into());
    tags.insert("artist".to_string(), artist.into());
    tags.insert("album".to_string(), album.into());
    tags.insert("date".to_string(), date.into());
    tags.insert("title".to_string(), title.into());
    tags.insert("comment".to_string(), comment.into());

    let mut res = Map::new();
    res.insert("filename".to_string(), filename.into());
    res.insert("path".to_string(), path.into());
    res.insert("tags".to_string(), Value::Object(tags));

    Ok(Value::Object(res))
}

pub fn get_album_art(path: &str) -> AlbumArt {
    let tag = Tag::new().read_from_path(path);
    let result = match tag {
        Ok(t) => {
            let picture = t.album_cover();
            match picture {
                Some(p) => AlbumArt {
                    mime_type: p.mime_type.into(),
                    data: p.data.to_owned().to_vec(),
                },
                None => AlbumArt {
                    mime_type: MimeType::Png.into(),
                    data: vec![0u8; 10],
                },
            }
        }
        Err(_) => AlbumArt {
            mime_type: MimeType::Png.into(),
            data: vec![0u8; 10],
        },
    };
    result
}

#[test]
fn is_success() {
    let result = get_tags("mocks/test.mp3");
    assert_eq!(result.is_ok(), true);
    assert!(result.unwrap().is_object());
}

#[test]
fn has_filename() {
    let result = get_tags("mocks/test.mp3").unwrap();
    let filename = result.get("filename").unwrap().as_str().unwrap();
    assert_eq!(filename, "test.mp3");
}

#[test]
fn has_path() {
    let result = get_tags("mocks/test.mp3").unwrap();
    let path = result.get("path").unwrap().as_str().unwrap();
    assert_eq!(path, "mocks/test.mp3");
}

#[test]
fn has_tags() {
    let result = get_tags("mocks/test.mp3").unwrap();
    let tags = result.get("tags").unwrap().as_object().unwrap();
    println!("{:?}", tags);
    assert_eq!(tags.len(), 7);
}

#[test]
fn correct_title() {
    let result = get_tags("mocks/test.mp3").unwrap();
    let tags = result.get("tags").unwrap().as_object().unwrap();
    let title = tags.get("title").unwrap().as_str().unwrap();
    assert_eq!(title, "Angel Eyes");
}
