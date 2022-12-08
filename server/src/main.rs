//! # Rain Server
//! HTTP Server for web and data management
//!
//! ## Routes
//! * `/` - `GET` Web
//! * `/cdn` - Video delivery (HLS)
//!     * `/` - `POST` upload multipart
//!     * `/:uuid/video.m3u8` - `GET` M3U8 file
//!     * `/:uuid/video#.ts` - `GET` Video segments
//! * `/data` - Video data (JSON)
//!     * `/` - `GET` All UUID videos
//!     * `/:uuid` - `GET` Video data
//! * `/thumbnail` - Get thumbnails (PNG)
//!     * `/lg/:uuid` - `GET` Large
//!     * `/sm/:uuid` - `GET` Small
//!
//! ## Panics
//! The server has handlers everywhere, is rare that fail.
//!
//! ## Asynchronous code
//! The server uses Tokio to handle IO calls

use axum::{extract::DefaultBodyLimit, response::IntoResponse, routing::get, Router};
use colored::Colorize;
use std::{net::SocketAddr, path::Path, str::from_utf8};
use tokio::fs::{create_dir, read};
use toml::from_str;

#[path = "./routes/app.rs"]
pub mod app;
#[path = "./routes/app_assets.rs"]
pub mod app_assets;
#[path = "./routes/content/m3u8.rs"]
pub mod cdn_m3u8;
#[path = "./routes/content/root.rs"]
pub mod cdn_root;
#[path = "./routes/content/segment.rs"]
pub mod cdn_segment;
#[path = "./routes/data/query.rs"]
pub mod data_query;
#[path = "./routes/data/root.rs"]
pub mod data_root;
#[path = "./routes/data/thumbnail_lg.rs"]
pub mod thumb_lg;
#[path = "./routes/data/thumbnail_sm.rs"]
pub mod thumb_sm;

pub mod handlers;
pub mod structs;

/// bad request handler
async fn bad_request() -> impl IntoResponse {
    handlers::bad_request()
}

/// not found handler
async fn not_found() -> impl IntoResponse {
    handlers::not_found()
}

/// ## Rain Server Main function
/// This function receives configuration data from `server.toml`.
/// Receives it and then mounts all routes, layers and fallbacks.
/// Finally checks the CDN folder and starts listening.
#[tokio::main]
async fn main() {
    println!("{} : Starting...", "Axum".bold().cyan());

    let config: structs::ServerConfig;

    match read(Path::new("../server.toml")).await {
        Err(_) => panic!("{} Failed to read `server.toml`", "ERROR".red()),
        Ok(data) => {
            config = from_str(from_utf8(&data).unwrap()).unwrap();
        }
    }

    let app = Router::new()
        // Root path (web)
        .route("/", get(app::handler))
        .route("/assets/:file", get(app_assets::handler))
        // Multipart handler (POST)
        .route("/cdn", get(bad_request).post(cdn_root::handler))
        // Video.m3u8 file handler
        .route("/cdn/:uuid/video.m3u8", get(cdn_m3u8::handler))
        // Video segment handler
        .route("/cdn/:uuid/:video_path", get(cdn_segment::handler))
        // All video IDs
        .route("/data", get(data_root::handler))
        // Video data handler
        .route("/data/:uuid", get(data_query::handler))
        // thumbnail handlers
        .route("/thumbnail", get(bad_request))
        .route("/thumbnail/sm", get(bad_request))
        .route("/thumbnail/lg", get(bad_request))
        .route("/thumbnail/sm/:uuid", get(thumb_sm::handler))
        .route("/thumbnail/lg/:uuid", get(thumb_lg::handler))
        // File limit
        .layer(DefaultBodyLimit::max(config.file_limit))
        // 404 handler
        .fallback(not_found);

    // note for me
    // RequestBodyLimitLayer is for specify routes
    // DefaultBodyLimit is for all routes

    println!("{}   : Checking CDN folder...", "FS".green().bold());

    if !Path::new("../cdn").is_dir() {
        println!(
            "{}   : Folder doesn't exists. Creating...",
            "FS".yellow().bold()
        );

        if let Some(err) = create_dir("../cdn").await.err() {
            panic!("Cannot create data folder: {}\nPanic", err)
        }
    } else {
        println!("{}   : Folder exists", "FS".green().bold());
    }

    // run server
    let addr = SocketAddr::from((config.ip, config.port));

    println!("{} : Server on {}", "Axum".bold().cyan(), addr);

    // listener
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
