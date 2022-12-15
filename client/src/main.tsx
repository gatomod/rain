import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import http from './http';
import './index.css';
import About from './pages/About';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import Upload from './pages/Upload';
import Video from './pages/Video';

/* import wallpaper1 from './assets/1.jpg';
import wallpaper2 from './assets/2.jpg';
import wallpaper3 from './assets/3.jpg';

const random = (arr: any[]) => {
	return arr[Math.floor(Math.random() * arr.length)];
};
const getImage = () => {
	const wallpapers = [wallpaper1, wallpaper2, wallpaper3];
	return random(wallpapers);
}; */

const App = () => {
	const [uuids, setUuids] = useState([]);

	useEffect(() => {
		http.get('/data')
			.then((res) => {
				setUuids(res.data.data);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<React.StrictMode>
			<BrowserRouter>
				<div
					/* style={{
					backgroundImage: `url("${getImage()}")`
				}}
				className='bg-cover bg-bottom bg-no-repeat' */
					className=''
				>
					<div className='flex flex-col bg-gray-100 h-screen backdrop-filter backdrop-blur-xl text-gray-900 overflow-y-auto pb-10'>
						<Header />
						<Routes>
							<Route path={'/'} element={<Main uuids={uuids} />} />
							<Route path={'/:uuid'} element={<Video uuids={uuids} />} />
							<Route path={'/upload'} element={<Upload setUuids={setUuids} />} />
							<Route path={'/about'} element={<About />} />
							<Route path={'/notfound'} element={<NotFound />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		</React.StrictMode>
	);
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
