import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import ReactHlsPlayer from 'react-hls-player';
import { Pause48Filled, Play48Filled, Play48Regular } from '@fluentui/react-icons';

const Video = () => {
	const { uuid } = useParams();
	const video = useRef<HTMLVideoElement>();
	const [data, setData] = useState({
		name: 'Sin título',
		author: 'Sin autor',
		thumbnail: '../assets/null.png',
		video: ''
	});

	const [isPlaying, setIsPlaying] = useState(false);
	const [videoPercentage, setVideoPercentage] = useState('0');

	// pause continue
	const keyHandler = (e: KeyboardEvent) => {
		if (video.current) {
			if (e.key == ' ') setIsPlaying((p) => !p);

			if (e.key == 'ArrowRight') video.current.currentTime += 5;
			if (e.key == 'ArrowLeft') video.current.currentTime -= 5;
			if (e.key == 'ArrowLeft') video.current.currentTime -= 5;
			if (e.key == 'Home') video.current.currentTime = 0;
			if (e.key == 'End') video.current.currentTime = video.current.duration;

			console.log(e.key, video.current.duration);
		}
	};

	useEffect(() => {
		http.get(`/data/${uuid}`).then((res) => {
			setData({
				name: res.data.name,
				author: res.data.author,
				thumbnail: `${http.getUri()}/thumbnail/lg/${uuid}`,
				video: `${http.getUri()}/cdn/${uuid}/video.m3u8`
			});
		});

		document.addEventListener('keydown', keyHandler);

		setInterval(() => {
			console.log(video.current && Math.round((video.current?.currentTime * 100) / video.current?.duration));
		}, 1000);
		return () => {
			document.removeEventListener('keydown', keyHandler);
		};
	}, []);

	useEffect(() => {
		isPlaying ? video.current?.play() : video.current?.pause();
	}, [isPlaying]);

	return (
		<div className='flex flex-col px-4 pt-6 gap-y-4'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>{data.name}</p>
			<div className='flex flex-col aspect-video h-fit'>
				<div className='flex flex-col justify-center items-center'>
					<ReactHlsPlayer
						poster={data.thumbnail}
						playerRef={video}
						onClick={() => setIsPlaying((p) => !p)}
						onPlay={(e) => {
							setInterval(() => {
								setVideoPercentage(
									(video.current &&
										Math.round(
											(video.current?.currentTime * 100) / video.current?.duration
										).toString()) ||
										'0'
								);
							}, 200);
						}}
						onEnded={() => setIsPlaying(false)}
						src={data.video}
						id='xdd'
						className='aspect-video bg-black rounded-lg'
					/>
					<div
						className={`self-start bg-red-500 h-2`}
						style={{
							width: videoPercentage + '%'
						}}
					></div>
					{isPlaying ? (
						<Pause48Filled
							onClick={() => setIsPlaying(false)}
							primaryFill=''
							className='fill-slate-200 origin-bottom hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animation-bounce'
						/>
					) : (
						<Play48Filled
							onClick={() => setIsPlaying(true)}
							primaryFill=''
							className='fill-slate-200 origin-bottom hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animation-bounce'
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Video;
