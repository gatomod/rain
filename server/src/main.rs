use axum::{
    body::StreamBody,
    extract::{Multipart, Query},
    http::{header, StatusCode},
    response::IntoResponse,
    routing::get,
    Router,
};
use colored::Colorize;
use mime_guess::from_ext;
use path_trav::is_path_trav;
use serde::{Deserialize, Serialize};
use std::{error::Error, net::SocketAddr, path::Path};
use tokio::fs::{create_dir, remove_dir, remove_file, write, File};
use tokio_util::io::ReaderStream;

#[tokio::main]
async fn main() {
    println!("{} : Starting...", "Axum".bold().cyan());

    let app = Router::new()
        .route("/", get(root))
        .route("/cdn", get(cdn_bad_request).post(cdn_post))
        .route("/cdn/:file_path", get(cdn_get))
        .fallback(not_found);

    println!("{}   : Checking CDN folder...", "FS".green().bold());

    if !Path::new("./cdn").is_dir() {
        println!(
            "{}   : Folder doesn't exists. Creating...",
            "CDN".yellow().bold()
        );

        if let Some(err) = create_dir("./cdn").await.err() {
            panic!("Cannot create data folder: {}\nPanic", err)
        }
    } else {
        println!("{}  : Folder exists", "CDN".yellow().bold());
    }

    // run server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!("{} : Server on {}", "Axum".bold().cyan(), addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// root
async fn root() -> String {
    "aquí va la web".to_string()
}

// not found
async fn not_found() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "Not found")
}

// cdn bad request
async fn cdn_bad_request() -> (StatusCode, &'static str) {
    (StatusCode::BAD_REQUEST, "Bad request")
}

// CDN post
async fn cdn_post(server_uri: axum::http::Uri, mut data: Multipart) -> impl IntoResponse {
    match data.next_field().await {
        // Multipart error
        Err(err) => {
            return Err((StatusCode::BAD_REQUEST, err.source().unwrap().to_string()));
        }

        // no files
        Ok(None) => {}

        // Ok
        Ok(Some(field)) => {
            let folder_name = field.file_name().unwrap().to_string().replace(" ", "-");

            let folder_path_pre = format!("./cdn/{}", folder_name);
            let folder_path = Path::new(&folder_path_pre);

            let file_path_pre = format!("./cdn/{}/video.mp4", folder_name);
            let file_path = Path::new(&file_path_pre);

            if folder_path.exists() {
                return Err((
                    StatusCode::CONFLICT,
                    format!("Folder {} already exists", folder_name),
                ));
            }

            // create temporal file to avoid path_trav error (worst solution)
            if let Some(_) = create_dir(folder_path).await.err() {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Internal server error".to_string(),
                ));
            }
            let path_trav = match is_path_trav(&Path::new("./cdn"), &folder_path) {
                Err(e) => {
                    println!("{}", e);
                    return Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "Internal server error".to_string(),
                    ));
                }
                Ok(val) => val,
            };

            if path_trav {
                if let Some(_) = remove_dir(file_path).await.err() {
                    return Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "Internal server error".to_string(),
                    ));
                }
                return Err((StatusCode::NOT_FOUND, "Not found".to_string()));
            }

            let data = field.bytes().await.unwrap();

            if let Some(_) = write(file_path, data).await.err() {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Internal server error".to_string(),
                ));
            }

            // return Ok((StatusCode::CREATED, format!("{}/{}/video.m3u8", server_uri, file_name)))
        }
    }

    Ok((StatusCode::OK, "multipart subido".to_string()))
}

// CDN get
#[derive(Deserialize, Serialize)]
struct FileQuery {
    name: String,
}

async fn cdn_get(axum::extract::Path(file_path): axum::extract::Path<String>) -> impl IntoResponse {
    if !Path::new(&format!("./cdn/{}/video.m3u8", file_path)).exists() {
        return Err((StatusCode::NOT_FOUND, "Not found".to_string()));
    }

    let file = match File::open(format!("./cdn/{}/video.m3u8", file_path)).await {
        Err(_) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ))
        }
        Ok(file) => file,
    };

    let stream = ReaderStream::new(file);
    let stream_body = StreamBody::new(stream);

    let ext_pre = file_path.split(".").collect::<Vec<&str>>();
    let ext = ext_pre.last().unwrap();
    let mime = match from_ext(ext).iter().last() {
        Some(mime) => mime.to_string(),
        None => "text/plain".to_string(),
    };

    let headers = [
        (header::CONTENT_TYPE, mime),
        (header::SERVER, "Never gonna give you up".to_string()),
    ];

    Ok((headers, stream_body))
}
