import { WeatherRain48Filled } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<div className='flex justify-between items-center bg-slate-800 drop-shadow-lg shadow-slate-700 px-5 py-3 select-none'>
			<Link to={'/'} className='flex gap-x-3 items-center'>
				<WeatherRain48Filled
					primaryFill=''
					className='fill-slate-200 active:fill-slate-400 w-14 h-14 transition-all'
				/>
				<p className='font-bold font-nunito text-slate-200 text-2xl active:text-slate-400 transition-all'>
					Rain
				</p>
			</Link>
			<div className='flex flex-grow justify-center mx-32'>
				<input
					className='
					bg-transparent
					border-2 border-slate-200 rounded-md
					px-8 py-2
					w-full
					text-center text-slate-200 placeholder-slate-200
					outline-none
					hover:border-slate-100 hover:-translate-y-1
					focus:border-none focus:bg-slate-100 focus:text-gray-900 focus:placeholder-gray-700
					active:translate-y-0
					animation-base
					'
					type='text'
					placeholder='Buscar por UUID'
				/>
			</div>
			<div>
				<Link
					to={'/upload'}
					className='font-bold font-nunito text-slate-200 text-lg hover:underline active:text-slate-400 transition-all'
				>
					Subir vídeo
				</Link>
			</div>
		</div>
	);
};

export default Header;
