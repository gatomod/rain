use axum::http::StatusCode;

/// 404
pub fn not_found() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "Not found")
}

/// 400
pub fn bad_request() -> (StatusCode, &'static str) {
    (StatusCode::BAD_REQUEST, "Bad request")
}

/// 409
pub fn conflict() -> (StatusCode, &'static str) {
    (StatusCode::CONFLICT, "Conflict")
}

/// 500
pub fn internal_server_error() -> (StatusCode, &'static str) {
    (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
}
