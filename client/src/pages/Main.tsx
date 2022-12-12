import VideoCard from '../components/VideoCard';

const Main = ({ uuids }: { uuids: string[] }) => {
	return (
		<div className='flex flex-col px-4 pt-6 gap-y-4'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>Videos</p>
			<div className='flex flex-wrap justify-center gap-x-4 gap-y-4 lg:gap-y-2'>
				{uuids.map((e) => (
					<VideoCard uuid={e} key={e} />
				))}
			</div>
		</div>
	);
};

export default Main;
