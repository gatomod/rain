import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../src/http';
import ReactHlsPlayer from 'react-hls-player';
import { Pause48Regular, Play48Regular, SkipBack1048Regular, SkipForward1048Regular } from '@fluentui/react-icons';
import moment from 'moment';
import VideoCard from '../src/components/VideoCard';

const Video = ({ uuids }: { uuids: string[] }) => {
	const { uuid } = useParams();
	const video = useRef<HTMLVideoElement | null>(null);
	const [data, setData] = useState({
		name: 'Sin título',
		author: 'Sin autor',
		thumbnail: '../assets/null.png',
		video: ''
	});

	const [startVideo, setStartVideo] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

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
			<div className='flex justify-around gap-x-8'>
				<div className='flex w-3/4 h-fit flex-grow aspect-video bg-red-500'>
					<div className=''>
						{startVideo ? (
							<ReactHlsPlayer
								playerRef={video}
								onClick={() => setIsPlaying((p) => !p)}
								onEnded={() => setIsPlaying(false)}
								src={data.video}
								controls
								className='aspect-video bg-black rounded-lg'
							/>
						) : (
							<img
								src={data.thumbnail}
								className='w-max h-full bg-contain bg-black bg-bottom bg-no-repeat rounded-lg'
							></img>
						)}
					</div>
				</div>
				<div className='flex flex-col gap-y-4'>
					{uuids.map((e) => e !== uuid && <VideoCard uuid={e} key={e} />)}
				</div>
			</div>
		</div>
	);
};

export default Video;
