/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				opensans: ['opensans', 'regular'],
				nunito: ['nunito', 'regular']
			},
			keyframes: {
				bouncespin: {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				bouncespin: 'bouncespin 1.5s cubic-bezier(.24,1.61,.27,.84) infinite',
				bounce: 'ease-[cubic-bezier(.24,1.61,.27,.84)] duration-300',
				base: 'ease-in-out duration-200'
			}
		}
	},
	plugins: []
};
