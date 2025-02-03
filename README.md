# Rain
An extremely minimalist video delivery platform made with React and Rust.

## Note
This was my first project in Rust, I made it a few years ago to use that language in a real project, but the code is too messy and inneficient so please, don't bother me with that.

I have the intention to rewrite it with the same stack and using it for my Final Degree Project, organizing it better, documenting it and using another libraries.

## Technologies
### Frontend
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Libs:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [React HLS Player](https://www.npmjs.com/package/react-hls-player)
- **Style:** [Tailwind](https://tailwindcss.com/)
- **HTTP:** [Axios](https://axios-http.com/)

### Backend
- **Language:** [Rust](https://www.rust-lang.org/)
- **Libs:** [Axum](https://github.com/tokio-rs/axum), [Tokio](https://tokio.rs/), [Tower HTTP](https://github.com/tower-rs/tower-http), [UUID](https://github.com/uuid-rs/uuid), [Serde](https://serde.rs/)
- **Protocols:** [HLS](https://www.rfc-editor.org/rfc/rfc8216), [HTTP 1.1](https://www.rfc-editor.org/rfc/rfc2616)
- **Video:** [FFMPEG](https://ffmpeg.org/), [FFMPEG Thumbnailer](https://github.com/dirkvdb/ffmpegthumbnailer)

## Getting started
To start using Rain you need to install certain programs and build it.
### Configuration
Before build Rain, you need to configure `server.toml`

- In `server.toml` set the port and the file limit (in bytes)
```toml
ip = [0, 0, 0, 0]
port = 3000
file_limit = 10_000_000_000 # In bytes
```


### Docker
To use docker, run the following commands.
```sh
# Clone the repo
git clone https://github.com/gatomod/rain && cd rain

# Build Dockerfile
docker build -t gatomo/rain:latest .

# Run the container
# - Choose a port. 80 is the default one
# - Volumes are used to preserve data. Choose a path
docker run --name rain -p 80:80 -v /route/to/store/cdn:/server/cdn gatomo/rain
```

### Manual build
#### Prerequisites
- FFmpeg
- FFmpeg Thumbnailer
- Rust and Cargo
- Node.js and Yarn

If you have all installed, update all to latest versions (not required but recommended).

#### Building
Run the following command to build server and client
```sh
# build client
cd client && yarn build

# build server
cd server && cargo build --release
```

#### Run
Run the server
```sh
cd server && cargo run --release
```

## API Endpoints
* `/` - `GET` Web
* `/assets/:asset` - `GET` Web assets
* `/api` - API endpoints
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


## License
Rain is licensed under the [GPL-3 license](https://www.gnu.org/licenses/gpl-3.0.html).

## Usage
There are some security and performance issues, so is recommended to personal use at home or testing.

## Contribute
🥳 Any PR is welcome! Rain is a small project, so please follow the code style and avoid making insane proposals.

*Gátomo - AGPL-3 License*
