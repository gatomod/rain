/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				opensans: ['opensans', 'regular'],
				nunito: ['nunito', 'regular']
			}
		}
	},
	plugins: []
};
