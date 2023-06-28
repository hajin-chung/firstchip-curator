/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'serif': "Nanum Myeongjo",
				'writing': "Satisfy",
			},
			colors: {
				yellow: {
					kakao: "#f9e000"
				}
			}
		},
	},
	darkMode: 'class',
	plugins: [],
}
