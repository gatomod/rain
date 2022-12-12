import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';

const VideoCard = ({ uuid }: { uuid: string }) => {
	const [img, setImg] = useState('../assets/null.png');
	const [name, setName] = useState('Sin título');
	const [author, setAuthor] = useState('Sin descripción');

	useEffect(() => {
		setImg(`${http.getUri()}/thumbnail/sm/${uuid}`);

		http.get(`/data/${uuid}`)
			.then((res) => {
				setName(res.data.name);
				setAuthor(res.data.author);
			})
			.catch(() => null);
	}, []);

	return (
		<Link
			to={`/${uuid}`}
			className='flex lg:flex-col flex-grow w-full lg:w-80 lg:max-w-sm hover:-translate-y-5 hover:drop-shadow-md active:-translate-y-1 active:drop-shadow-sm animate-bounce delay-100'
		>
			<img
				draggable={false}
				className='rounded-l-xl lg:rounded-l-none lg:rounded-t-xl w-1/3 lg:w-auto object-cover aspect-video'
				src={img}
				alt=''
			/>
			<div className='flex flex-grow lg:w-auto flex-col gap-y-2 px-4 pt-2 pb-3 bg-slate-300 rounded-r-xl lg:rounded-r-none lg:rounded-b-xl'>
				<p className='font-semibold text-slate-800'>{name}</p>
				<p className='text-sm text-slate-700'>{author}</p>
			</div>
		</Link>
	);
};

export default VideoCard;
