use std::{
    path::Path,
    time::{SystemTime, UNIX_EPOCH},
};

use axum::{extract::Multipart, http::StatusCode, response::IntoResponse};
use colored::Colorize;
use mime_guess::get_extensions;
use tokio::{
    fs::{create_dir, remove_dir, remove_file, write},
    process::Command,
};
use uuid::Uuid;

use crate::{
    handlers::{bad_request, conflict, internal_server_error},
    structs,
};

/// ## CDN Handler
/// This function receives multipart and returns the UUID
pub async fn handler(mut data: Multipart) -> impl IntoResponse {
    /// Removes folder and returns an HTTP 500 error
    async fn http_500_rm(fold: &Path) -> (StatusCode, &'static str) {
        if fold.exists() {
            if let Some(_) = remove_dir(fold).await.err() {
                return internal_server_error();
            }
        }

        internal_server_error()
    }

    // data
    let uuid = Uuid::new_v4();
    let folder_pre = &format!("../cdn/{}", uuid);
    let folder = Path::new(folder_pre);
    let mut mime_ext = "".to_string();

    if folder.exists() {
        return Err(conflict());
    }

    // create dir
    if let Some(_) = create_dir(folder).await.err() {
        return Err(http_500_rm(&folder).await);
    }

    // parse multipart
    while let Ok(Some(field)) = data.next_field().await {
        let cont_type = field.content_type().unwrap_or("");

        if field.name().unwrap() == "video" && cont_type.starts_with("video/") {
            // video

            let mime = field
                .content_type()
                .unwrap()
                .split("/")
                .collect::<Vec<&str>>();

            let ext = match get_extensions(mime[0], mime[1]) {
                Some(ext) => ext[0].to_string(),
                None => "mp4".to_string(),
            };

            mime_ext = ext;

            let data = match field.bytes().await {
                Err(_) => return Err(http_500_rm(&folder).await),
                Ok(val) => val,
            };

            if let Some(_) = write(folder.join(format!("video.{}", &mime_ext)), data)
                .await
                .err()
            {
                return Err(http_500_rm(&folder).await);
            }
        } else if field.name().unwrap() == "data" {
            // data

            let payload: structs::CDNPayloadPost = match serde_json::from_str(
                &String::from_utf8(field.bytes().await.unwrap().to_vec()).unwrap(),
            ) {
                Ok(data) => data,
                Err(_) => {
                    return Err(bad_request());
                }
            };

            if payload.author.len() > 80 && payload.name.len() > 80 {
                return Err(bad_request());
            }

            let json_data = &structs::DataFile {
                name: payload.name,
                author: payload.author,
                date: SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_millis(),
            };

            if let Some(_) = write(
                folder.join("data.json"),
                serde_json::to_string(&json_data).unwrap(),
            )
            .await
            .err()
            {
                return Err(http_500_rm(&folder).await);
            }
        } else {
            return Err(bad_request());
        }
    }

    // ffmpeg -i video.mp4 -hls_time 5 -hls_list_size 0 -f hls video.m3u8
    if let Some(_) = Command::new("ffmpeg")
        .current_dir(&folder)
        .args(&[
            "-loglevel",
            "panic",
            "-i",
            &format!("video.{}", mime_ext),
            if mime_ext == "mp4" { "-c" } else { "-loglevel" },
            if mime_ext == "mp4" { "copy" } else { "panic" },
            "-hls_time",
            "5",
            "-hls_list_size",
            "0",
            "-f",
            "hls",
            "video.m3u8",
        ])
        .output()
        .await
        .err()
    {
        return Err(http_500_rm(&folder).await);
    }

    // ffmpegthumbnailer -i video.mp4 -s 0 -t 50% -o thumbnail.png
    if let Some(_) = Command::new("ffmpegthumbnailer")
        .current_dir(&folder)
        .args(&[
            "-i",
            "video.m3u8",
            "-s",
            "0",
            "-q",
            "10",
            "-t",
            "20%",
            "-o",
            "thumbnail_lg.png",
        ])
        .output()
        .await
        .err()
    {
        return Err(http_500_rm(&folder).await);
    }

    // ffmpegthumbnailer -i video.mp4 -s 512 -t 50% -o thumbnail.png
    if let Some(_) = Command::new("ffmpegthumbnailer")
        .current_dir(&folder)
        .args(&[
            "-i",
            "video.m3u8",
            "-s",
            "512",
            "-q",
            "10",
            "-t",
            "20%",
            "-o",
            "thumbnail_sm.png",
        ])
        .output()
        .await
        .err()
    {
        return Err(http_500_rm(&folder).await);
    }

    if let Some(_) = remove_file(&folder.join(format!("video.{}", mime_ext)))
        .await
        .err()
    {
        return Err(http_500_rm(&folder).await);
    }

    println!("{}  : Video {} created", "CDN".yellow().bold(), uuid);

    Ok((StatusCode::OK, uuid.to_owned().to_string()))
}
