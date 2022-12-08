use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct DataFile {
    pub name: String,
    pub author: String,
    pub date: u128,
}

#[derive(Deserialize, Serialize)]
pub struct CDNPayloadPost {
    pub name: String,
    pub author: String,
}

#[derive(Deserialize, Serialize)]
pub struct DataRootPayload {
    pub data: Vec<String>,
}

#[derive(Deserialize, Serialize)]
pub struct ServerConfig {
    pub ip: [u8; 4],
    pub port: u16,
    pub file_limit: usize,
}
