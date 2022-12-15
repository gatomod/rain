# Is my first dockerfile, I don't know how it works exactly so sure doesn't work properly

FROM archlinux

LABEL maintainer="Gátomo"

RUN pacman -Syyu

RUN pacman -S node yarn rust ffmpeg ffmpegthumbnailer

RUN rustup update

RUN cd server && cargo build --release

RUN cd client && yarn build

EXPOSE 3000

CMD [ "cargo run --release" ]