# Rain
An extremely minimalist video delivery platform made with React and Rust.

## Technologies
### Frontend
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Libs:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [React HLS Player](https://www.npmjs.com/package/react-hls-player)
- **Style:** [Tailwind](https://tailwindcss.com/)
- **HTTP:** [Axios](https://axios-http.com/)

### Backend
- **Language:** [Rust](https://www.rust-lang.org/es)
- **Libs:** [Axum](https://github.com/tokio-rs/axum), [Tokio](https://tokio.rs/), [Tower HTTP](https://github.com/tower-rs/tower-http), [UUID](https://github.com/uuid-rs/uuid), [Serde](https://serde.rs/)
- **Protocols:** [HLS](https://www.rfc-editor.org/rfc/rfc8216), [HTTP 1.1](https://www.rfc-editor.org/rfc/rfc2616)
- **Video:** [FFMPEG](https://ffmpeg.org/), [FFMPEG Thumbnailer](https://github.com/dirkvdb/ffmpegthumbnailer)

## Getting started
To start using Rain you need to install certain programs and build it.
### Configuration
Before build Rain, you need to configure two files in repository: `client.json` and `server.toml`

- In `server.toml` set the port and the file limit (in bytes)
```toml
ip = [0, 0, 0, 0]
port = 3000
file_limit = 10_000_000_000 # In bytes
```

- In `client.json` set the server IP
- **Note:** The server IP must be the computer IP or the public domain because the client isn't SSR, it makes request to the server. Is really inefficient but it works.
```json
{
    "server": "http://10.0.0.20:3000"
}
```
### Manual build (recommended)
#### Prerrequisites
- FFMPEG
- FFMPEG Thumbnailer
- Rust and Cargo
- Node.js and Yarn

If you have all installed, update all to latest versions.

#### Building
Run the following command to build server and client
```sh
# build client
cd client && yarn build;

# build server
cd server && cargo build --release
```

#### Run
Run the server
```sh
cd server && cargo run --release
```

### Docker (not working)
I don't know how to use Docker. I tried to make a Dockerfile but I don't know if works. You can see it and modify at your own judgment.


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
🥳 Any PR is welcome! Is a small project, so the guideline is to follow the code style and not make insane purposes.

## Links
- [Web](https://gatomo.ga)
- [Donate (via PayPal)](https://paypal.me/gatomooficial)
- [Discord (Spanish)](https://gatomo.ga/discord)
- [Revolt (Spanish)](https://gatomo.ga/revolt)

*Gátomo - GPL-3 License*
