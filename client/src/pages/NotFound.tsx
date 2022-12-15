import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className='flex flex-col lg:items-start items-center px-4 pt-6 gap-y-4'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>404 Not Found</p>
			<Link className='underline' to={'/'}>
				Return to home
			</Link>
		</div>
	);
};

export default NotFound;
