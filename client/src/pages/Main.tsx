import { PlayCircle48Regular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
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
		<div className='flex flex-col flex-grow w-80 max-w-sm hover:z-10 hover:scale-125 transition-all'>
			<img className='rounded-t-xl object-cover aspect-video' src={img} alt='' />
			<div className='flex flex-col gap-y-2 px-4 pt-2 pb-3 bg-slate-200 rounded-b-xl'>
				<p className='font-semibold'>{name}</p>
				<p className='text-sm text-slate-700'>{author}</p>
			</div>
		</div>
	);
};

const Main = () => {
	const [uuids, setUuids] = useState([]);

	useEffect(() => {
		http.get('/data').then((res) => {
			setUuids(res.data.data);
		});
	}, []);

	return (
		<div className='flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 py-2'>
			{uuids.map((e) => (
				<VideoCard uuid={e} key={e} />
			))}
		</div>
	);
};

export default Main;
