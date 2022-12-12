import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import ReactHlsPlayer from 'react-hls-player';
import {
	Pause48Filled,
	Pause48Regular,
	Play48Filled,
	Play48Regular,
	SkipBack1048Regular,
	SkipForward1048Regular
} from '@fluentui/react-icons';
import moment from 'moment';

const Video = () => {
	const { uuid } = useParams();
	const video = useRef<HTMLVideoElement | null>(null);
	const [data, setData] = useState({
		name: 'Sin título',
		author: 'Sin autor',
		thumbnail: '../assets/null.png',
		video: ''
	});

	const [isPlaying, setIsPlaying] = useState(false);
	const [videoTime, setVideoTime] = useState(0);
	const [videoRefTime, setVideoRefTime] = useState(0);

	// pause continue
	const keyHandler = (e: KeyboardEvent) => {
		if (e.key == ' ') setIsPlaying((p) => !p);

		if (e.key == 'ArrowRight') video.current!.currentTime += 10;
		if (e.key == 'ArrowLeft') video.current!.currentTime -= 10;
		if (e.key == 'Home') video.current!.currentTime = 0;
		if (e.key == 'End') video.current!.currentTime = video.current!.duration;
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

		setVideoRefTime(0);

		return () => {
			document.removeEventListener('keydown', keyHandler);
		};
	}, []);

	useEffect(() => {
		isPlaying ? video.current?.play() : video.current?.pause();
	}, [isPlaying]);

	useEffect(() => {
		setVideoRefTime(videoTime);
	}, [videoTime]);

	return (
		<div className='flex flex-col px-4 pt-6 gap-y-4'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>{data.name}</p>
			<div className='flex flex-col aspect-video h-fit'>
				<div className='flex flex-col justify-center items-center'>
					<ReactHlsPlayer
						poster={data.thumbnail}
						playerRef={video}
						onClick={() => setIsPlaying((p) => !p)}
						onTimeUpdate={() =>
							setVideoTime((video.current!.currentTime * 100) / video.current!.duration || 0)
						}
						onEnded={() => setIsPlaying(false)}
						src={data.video}
						id='xdd'
						className='aspect-video bg-black rounded-t-lg'
					/>
					<div className='flex flex-col justify-center items-center w-full gap-y-2 pb-3 bg-slate-800 rounded-b-lg'>
						{/* <div className='flex flex-col w-full'>
							<div className='bg-gray-900 h-2 w-full'></div>
							<div
								className='absolute bg-blue-500 h-2'
								style={{
									width: videoPercentage + '%'
								}}
							></div>
						</div> */}
						<input
							value={videoTime}
							onChange={(e) =>
								setVideoTime((video.current!.currentTime * 100) / parseFloat(e.target.value))
							}
							type='range'
							className='w-full'
							id='timeline'
							min='0'
							max='100'
						/>
						<div className='flex items-center justify-between w-full px-6'>
							{/* <p className='text-slate-300'>{actualTime}</p> */}

							<div className='flex gap-x-8 py-2'>
								<SkipBack1048Regular
									onClick={() => (video.current!.currentTime -= 10)}
									primaryFill=''
									className='w-8 h-8 fill-slate-200 origin-bottom hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animate-bounce'
								/>
								{isPlaying ? (
									<Pause48Regular
										onClick={() => setIsPlaying(false)}
										primaryFill=''
										className='w-8 h-8 fill-slate-200 origin-bottom hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animate-bounce'
									/>
								) : (
									<Play48Regular
										onClick={() => setIsPlaying(true)}
										primaryFill=''
										className='w-8 h-8 fill-slate-200 origin-bottom hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animate-bounce'
									/>
								)}
								<SkipForward1048Regular
									onClick={() => (video.current!.currentTime += 10)}
									primaryFill=''
									className='w-8 h-8 fill-slate-200 origin-bottom hover:fill-slate-100 hover:scale-110 hover:drop-shadow-md active:fill-slate-400 active:scale-100 animate-bounce'
								/>
							</div>
							{/* <p className='text-slate-300'>
								{moment.utc((video.current?.duration ?? 0) * 1000).format('HH:mm:ss')}
							</p> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Video;
