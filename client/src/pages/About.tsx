import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
	return (
		<div className='flex flex-col lg:items-start items-center px-4 pt-6 gap-y-4'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>About Rain</p>
			<p className='text-center lg:text-start'>
				Rain is an extremely simple video delivery platform made with React and Rust by Gátomo. Is just a personal project for learn and practice
			</p>
			<p className='font-nunito text-xl font-bold text-gray-800 mt-2 mb-1'>Is free?</p>
			<p className='text-center lg:text-start'>Yes, it's free (as in price as freedom). Rain is licensed under the AGPL-3 license, so is an open source project.</p>
			<p className='font-nunito text-xl font-bold text-gray-800 mt-2 mb-1'>Is secure?</p>
			<p className='text-center lg:text-start'>Not at all, this is the first version, there are some big issues (just try it by yourself lol).</p>
			<p className='font-nunito text-xl font-bold text-gray-800 mt-2 mb-1'>Is fast?</p>
			<p className='text-center lg:text-start'>
				Yes, the server is built with Axum (based on Hyper.rs) so is unnecessarily fast, but the code could be not very well optimized.
			</p>
			<div className='pt-4'>
				<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>Links</p>
				<ul className='list-disc list-inside'>
					<li>
						<a href='https://github.com/gatomod/rain'>Repository</a>
					</li>
					<li>
						<a href='https://github.com/gatomod'>Gátomo</a>
					</li>

					<li>
						<a href='https://github.com/gatomod/rain/blob/main/LICENSE'>License</a>
					</li>
				</ul>
			</div>
			<Link className='underline' to={'/'}>
				Return to home
			</Link>
		</div>
	);
};

export default About;
