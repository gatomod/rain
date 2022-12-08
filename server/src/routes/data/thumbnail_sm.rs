use std::path::Path;

use axum::{
    body::StreamBody, extract::Path as PathURI, http::header::CONTENT_TYPE, response::IntoResponse,
};
use tokio::fs::File;
use tokio_util::io::ReaderStream;

use crate::handlers::{internal_server_error, not_found};

/// ## Small thumbnail handler
/// Serve small thumbnail
pub async fn handler(PathURI(uuid): PathURI<String>) -> impl IntoResponse {
    if !Path::new(&format!("../cdn/{}/thumbnail_sm.png", uuid)).exists() {
        return Err(not_found());
    }

    let file = match File::open(format!("../cdn/{}/thumbnail_sm.png", uuid)).await {
        Err(_) => {
            return Err(internal_server_error());
        }
        Ok(file) => file,
    };

    let stream = ReaderStream::new(file);
    let stream_body = StreamBody::new(stream);

    Ok(([(CONTENT_TYPE, "image/png")], stream_body))
}
