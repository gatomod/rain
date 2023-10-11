# Is my first dockerfile, I don't know how it works exactly so sure doesn't work properly

FROM rust:alpine

# Workdir
WORKDIR /server
COPY . /server

# Dependencies
RUN apk add nodejs yarn ffmpeg ffmpegthumbnailer musl-dev

RUN rustup update stable

# Build
RUN cd client && yarn && yarn build
RUN cd server && cargo build --release

# Expose and run
EXPOSE 80
CMD cargo run --release
