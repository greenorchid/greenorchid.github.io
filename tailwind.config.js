/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'hidden',
		'md:hidden',
		'md:flex',
		'md:block',
		'flex',
		'flex-1',
		'justify-center',
		'gap-2'
	],
	theme: {
		extend: {}
	},
	plugins: []
};
