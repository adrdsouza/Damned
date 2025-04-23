import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// could also be 'netlify', 'vercel', etc.
			fallback: 'index.html'
		}),
		csrf: {
			checkOrigin: true
		},
		prerender: {
			handleMissingId: 'ignore'
		}
	}
};

export default config;