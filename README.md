# Rain
An extremely minimalist video delivery platform made with React and Rust.

## Technologies
### Frontend
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Libs:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Style:** [Tailwind](https://tailwindcss.com/)
- **HTTP:** [Axios](https://axios-http.com/)

### Backend
- **Language:** [Rust](https://www.rust-lang.org/es)
- **Libs:** [Axum](https://github.com/tokio-rs/axum), [Tokio](https://tokio.rs/), [Tower HTTP](https://github.com/tower-rs/tower-http), [UUID](https://github.com/uuid-rs/uuid), [Serde](https://serde.rs/)
- **Protocols:** [HLS](https://www.rfc-editor.org/rfc/rfc8216), [HTTP 1.1](https://www.rfc-editor.org/rfc/rfc2616)
- **Video:** [FFMPEG](https://ffmpeg.org/), [FFMPEG Thumbnailer](https://github.com/dirkvdb/ffmpegthumbnailer)

## Server routes
* `/` - `GET` Web
* `/cdn` - Video delivery (HLS)
    * `/` - `POST` upload multipart
    * `/:uuid/video.m3u8` - `GET` M3U8 file
    * `/:uuid/video#.ts` - `GET` Video segments
* `/data` - Video data (JSON)
    * `/` - `GET` All UUID videos
    * `/:uuid` - `GET` Video data
* `/thumbnail` - Get thumbnails (PNG)
    * `/lg/:uuid` - `GET` Large
    * `/sm/:uuid` - `GET` Small

