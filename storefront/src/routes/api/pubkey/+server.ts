import { json } from '@sveltejs/kit';

// Hardcoded publishable API key as identified in the documentation
const PUBLISHABLE_API_KEY = "pk_4a68e1bd85e72212ebbe8364d329891e7bdabcc921912541f37078fcfe197bfe";

export async function GET() {
  return json({
    publishableKey: PUBLISHABLE_API_KEY
  });
}