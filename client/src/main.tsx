import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import Upload from './pages/Upload';
import Video from './pages/Video';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<div className='flex flex-col w-full h-screen bg-slate-50'>
				<Header />
				<Routes>
					<Route path={'/'} element={<Main />} />
					<Route path={'/:uuid'} element={<Video />} />
					<Route path={'/upload'} element={<Upload />} />
					<Route path={'*'} element={<NotFound />} />
				</Routes>
			</div>
		</BrowserRouter>
	</React.StrictMode>
);
