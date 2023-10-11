# Is my first dockerfile, I don't know how it works exactly so sure doesn't work properly

FROM archlinux

RUN pacman -S node pnpm rust ffmpeg ffmpegthumbnailer

RUN rustup update

RUN cd server && cargo build --release

RUN cd client && yarn build

EXPOSE 80

CMD [ "cargo run --release" ]