import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import ReactHlsPlayer from 'react-hls-player';
import { PlayCircle48Filled } from '@fluentui/react-icons';
import moment from 'moment';
import VideoCard from '../components/VideoCard';

const Video = ({ uuids }: { uuids: string[] }) => {
	const { uuid } = useParams();
	const video = useRef<HTMLVideoElement | null>(null);
	const [data, setData] = useState({
		name: 'Sin título',
		author: 'Sin autor',
		thumbnail: '../assets/null.png',
		date: Date.now(),
		video: ''
	});

	const [startVideo, setStartVideo] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	const navigate = useNavigate();

	// pause continue
	const keyHandler = (e: KeyboardEvent) => {
		e.preventDefault();

		if (e.key == ' ') setIsPlaying((p) => !p);

		if (e.key == 'ArrowRight') video.current!.currentTime += 10;
		if (e.key == 'ArrowLeft') video.current!.currentTime -= 10;
		if (e.key == 'Home') video.current!.currentTime = 0;
		if (e.key == 'End') video.current!.currentTime = video.current!.duration;
	};

	useEffect(() => {
		moment.locale(navigator.language);
		setStartVideo(false);
		setIsPlaying(false);

		http.get(`/data/${uuid}`)
			.then((res) => {
				setData({
					name: res.data.name,
					author: res.data.author,
					thumbnail: `${http.getUri()}/thumbnail/lg/${uuid}`,
					date: res.data.date,
					video: `${http.getUri()}/cdn/${uuid}/video.m3u8`
				});
			})
			.catch((err) => {
				if (err.response) {
					if (err.response.status == 404) navigate(`/notfound`);
				}
			});

		document.addEventListener('keydown', keyHandler);

		return () => {
			document.removeEventListener('keydown', keyHandler);
		};
	}, [uuid]);

	useEffect(() => {
		isPlaying ? video.current?.play() : video.current?.pause();
	}, [isPlaying]);

	return (
		<div className='flex flex-col px-4 gap-y-4'>
			<div className='flex flex-col lg:flex-row justify-around gap-x-8'>
				<div className='flex sticky pt-6 top-16 z-40 lg:z-0 lg:top-24 flex-col w-full lg:w-3/4 h-fit flex-grow gap-y-4 bg-gray-100'>
					<div className='flex h-fit flex-grow justify-center aspect-video bg-black rounded-lg'>
						{startVideo ? (
							<ReactHlsPlayer
								playerRef={video}
								onClick={() => setIsPlaying((p) => !p)}
								onEnded={() => setIsPlaying(false)}
								src={data.video}
								controls
								autoPlay
								className='aspect-video bg-black rounded-lg w-full outline-none'
							/>
						) : (
							<img
								src={data.thumbnail}
								className='lg:w-max lg:h-full bg-contain bg-black bg-bottom bg-no-repeat rounded-lg aspect-video'
							></img>
						)}
						{!startVideo && (
							<PlayCircle48Filled
								onClick={() => setStartVideo(true)}
								primaryFill=''
								className='absolute bottom-1/2 w-28 h-28 fill-slate-200 hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animate-bounce'
							/>
						)}
					</div>
					<div className='flex flex-col gap-y-1 pb-6 lg:pb-0'>
						<p className='font-nunito text-3xl font-bold text-gray-800'>{data.name}</p>
						<div className='flex flex-col gap-y-2 lg:flex-row gap-x-4'>
							<p className='font-nunito text-xl text-gray-700'>{data.author}</p>
							<p className='text-xl text-gray-500'>
								{moment(data.date).format('D [/] M [/] YYYY')} ( {moment(data.date).fromNow()} )
							</p>
						</div>
					</div>
				</div>
				<div className='flex flex-wrap justify-around lg:flex-col gap-y-4 gap-x-4 shadow-inner shadow-slate-50 pt-6 lg:pt-0 lg:shadow-none'>
					{uuids.map((e) => e !== uuid && <VideoCard uuid={e} key={e} />)}
				</div>
			</div>
		</div>
	);
};

export default Video;
