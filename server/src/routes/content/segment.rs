use std::path::Path;

use axum::{
    body::StreamBody, extract::Path as PathURI, http::header::CONTENT_TYPE, response::IntoResponse,
};
use tokio::fs::File;
use tokio_util::io::ReaderStream;

use crate::handlers::{internal_server_error, not_found};

/// ## Segment handler
/// Find and serve `video.ts` HLS segment
pub async fn handler(PathURI((uuid, segment)): PathURI<(String, String)>) -> impl IntoResponse {
    if !Path::new(&format!("../cdn/{}/{}", uuid, segment)).exists() {
        return Err(not_found());
    }

    let file = match File::open(format!("../cdn/{}/{}", uuid, segment)).await {
        Err(_) => {
            return Err(internal_server_error());
        }
        Ok(file) => file,
    };

    let stream = ReaderStream::new(file);
    let stream_body = StreamBody::new(stream);

    Ok(([(CONTENT_TYPE, "video/MP2T")], stream_body))
}
