use std::path::Path;

use axum::{body::StreamBody, http::header::CONTENT_TYPE, response::IntoResponse};
use tokio::fs::File;
use tokio_util::io::ReaderStream;

use crate::handlers::{internal_server_error, not_found};

/// ## Web server
/// Serve Web
pub async fn handler() -> impl IntoResponse {
    if !Path::new(Path::new("../app/index.html")).exists() {
        return Err(not_found());
    }

    let file = match File::open(Path::new("../app/index.html")).await {
        Err(_) => {
            return Err(internal_server_error());
        }
        Ok(file) => file,
    };

    let stream = ReaderStream::new(file);
    let stream_body = StreamBody::new(stream);

    Ok(([(CONTENT_TYPE, "text/html")], stream_body))
}
