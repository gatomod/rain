import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const Main = ({ uuids }: { uuids: string[] }) => {
	return (
		<div className='flex flex-col px-4 pt-6 gap-y-4'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>Videos</p>
			{uuids.length ? (
				<div className='flex flex-wrap justify-center gap-x-4 gap-y-4 lg:gap-y-2'>
					{uuids.map((e) => (
						<VideoCard uuid={e} key={e} />
					))}
				</div>
			) : (
				<div className='flex items-center lg:items-start flex-col gap-y-4'>
					<p className='text-center lg:text-start'>It looks that nobody uploaded a video yet</p>
					<Link className='underline' to={'/upload'}>
						Upload the first video
					</Link>
				</div>
			)}
		</div>
	);
};

export default Main;
