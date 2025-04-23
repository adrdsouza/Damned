export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  preview: {
    allowedHosts: ['damneddesigns.com']
  },
  define: {
    'import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY': JSON.stringify(process.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY)
  }
});