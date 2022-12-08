use std::path::Path;

use axum::{http::header::CONTENT_TYPE, response::IntoResponse};
use serde_json::to_string;
use tokio::fs::read_dir;

use crate::{handlers::internal_server_error, structs::DataRootPayload};

/// ## Global data handler
/// Find all videos and returns an UUID array
pub async fn handler() -> impl IntoResponse {
    match read_dir(&Path::new("../cdn")).await {
        Ok(mut data) => {
            let mut ids: Vec<String> = vec![];
            while let Ok(Some(dir)) = data.next_entry().await {
                ids.push(dir.file_name().to_string_lossy().to_string());
            }

            let data_payload = DataRootPayload { data: ids };
            return Ok((
                [(CONTENT_TYPE, "application/json")],
                to_string(&data_payload).unwrap_or("{data:[]}".to_string()),
            ));
        }
        Err(_) => return Err(internal_server_error()),
    }
}
