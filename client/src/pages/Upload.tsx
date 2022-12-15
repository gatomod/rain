import { ArrowClockwise48Regular, ArrowUpload24Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../http';

const Upload = ({ setUuids }: { setUuids: any }) => {
	const getSize = (size: number) => {
		let mb = size / 1024 / 1024;

		return mb > 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
	};

	const [payload, setPayload] = useState<{ name: string; author: string; video: File }>({
		name: '',
		author: '',
		video: new File([], '')
	});

	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<number>();

	const navigate = useNavigate();

	const submit = (e: React.MouseEvent) => {
		e.preventDefault();
		console.log(!payload.name || !payload.author || !payload.video.name);
		if (!payload.name || !payload.author || !payload.video.name) {
			setError(10);
			return;
		}

		setSubmitted(true);

		let formData = new FormData();
		formData.append('data', JSON.stringify({ name: payload.name, author: payload.author }));
		formData.append('video', payload.video);

		http.post('/cdn', formData, {
			headers: {
				'content-type': 'multipart/form-data'
			}
		})
			.then((res) => {
				http.get('/data').then((res) => {
					setUuids(res.data.data);
				});
				navigate(`/${res.data}`);
			})
			.catch((err) => {
				if (err.response) {
					if (err.response.status == 400) setError(400);
					if (err.response.status == 409) setError(409);
					if (err.response.status == 500) setError(500);
				}
			});
	};
	return (
		<div className='flex flex-col px-4 pt-6 gap-y-4 select-none'>
			<p className='font-nunito text-3xl font-bold text-gray-800 mb-1'>Upload a video</p>
			<div className='flex flex-col lg:flex-row gap-y-8 lg:gap-y-0 lg:gap-x-8'>
				<label htmlFor='drop' className='w-full flex-grow lg:w-1/3'>
					<div className='flex flex-col justify-center items-center rounded-xl aspect-video bg-slate-300 rounded-b-xl opacity-70 backdrop-filter backdrop-blur-lg hover:-translate-y-5 hover:drop-shadow-md active:-translate-y-1 active:drop-shadow-sm animate-bounce'>
						{!submitted ? (
							<ArrowUpload24Regular
								primaryFill=''
								className='fill-slate-800 hover:fill-slate-700 active:fill-slate-900 w-16 h-16'
							/>
						) : (
							<ArrowClockwise48Regular
								primaryFill=''
								className='fill-slate-800 hover:fill-slate-700 active:fill-slate-900 animate-bouncespin w-16 h-16'
							/>
						)}
						<p className='mt-4 px-8 text-center'>
							{payload.video.name
								? `${payload.video.name.replace(/\.[^/.]+$/, '')} ( ${getSize(payload.video.size)} )`
								: 'Click to select a video'}
						</p>
					</div>
					<input
						onChange={(e) =>
							setPayload({
								...payload,
								video: e.target.files![0],
								name: e.target.files![0].name.replace(/\.[^/.]+$/, '')
							})
						}
						type='file'
						className='hidden'
						id='drop'
						accept='video/*'
						required={true}
					/>
				</label>
				<div className='flex flex-col gap-y-8 lg:w-3/5'>
					<div>
						<p className='font-nunito text-xl font-bold text-gray-700 mb-1'>Name</p>
						<input
							required={true}
							className='w-full px-4 py-2 rounded-md outline-none bg-slate-300 opacity-70 backdrop-filter backdrop-blur-lg placeholder-slate-600'
							type='text'
							placeholder='Name'
							value={payload.name}
							onChange={(e) => setPayload({ ...payload, name: e.target.value })}
						/>
					</div>
					<div>
						<p className='font-nunito text-xl font-bold text-gray-700 mb-1'>Author</p>
						<input
							required={true}
							className='w-full px-4 py-2 rounded-md outline-none bg-slate-300 opacity-70 backdrop-filter backdrop-blur-lg placeholder-slate-600'
							type='text'
							placeholder='Author'
							value={payload.author}
							onChange={(e) => setPayload({ ...payload, author: e.target.value })}
						/>
					</div>
					<button
						onClick={(e) => submit(e)}
						disabled={submitted}
						className='px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-800 font-bold text-slate-100 animate-base disabled:bg-slate-400'
					>
						Upload
					</button>
					{error && (
						<p className='text-red-600'>
							<b>Error:</b> {error == 400 && 'Invalid data'}
							{error == 409 && 'Server error - Try again'}
							{error == 500 && 'Server error - Try again'}
							{error == 10 && 'Please fill all fields'}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Upload;
