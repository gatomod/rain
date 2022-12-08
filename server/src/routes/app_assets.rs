use std::path::Path;

use axum::{
    body::StreamBody, extract::Path as PathURI, http::header::CONTENT_TYPE, response::IntoResponse,
};
use mime_guess::from_ext;
use tokio::fs::File;
use tokio_util::io::ReaderStream;

use crate::handlers::{internal_server_error, not_found};

/// ## Web server
/// Serve Web
pub async fn handler(PathURI(asset): PathURI<String>) -> impl IntoResponse {
    if !Path::new(Path::new(&format!("../app/assets/{}", asset))).exists() {
        return Err(not_found());
    }

    let file = match File::open(Path::new(&format!("../app/assets/{}", asset))).await {
        Err(_) => {
            return Err(internal_server_error());
        }
        Ok(file) => file,
    };

    let stream = ReaderStream::new(file);
    let stream_body = StreamBody::new(stream);

    let ext_pre = asset.split(".").collect::<Vec<&str>>();
    let ext = ext_pre.last().unwrap();
    let mime = match from_ext(ext).iter().last() {
        Some(mime) => mime.to_string(),
        None => "text/plain".to_string(),
    };

    Ok(([(CONTENT_TYPE, mime)], stream_body))
}
