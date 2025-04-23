import { PUBLIC_MEDUSA_PUBLISHABLE_KEY } from '$env/dynamic/private';

export async function GET({ url, request, cookies, locals, params, setHeaders, fetch }) {
  return new Response(JSON.stringify({ publishableKey: PUBLIC_MEDUSA_PUBLISHABLE_KEY }), { status: 200 })
}