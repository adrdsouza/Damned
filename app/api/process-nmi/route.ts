export async function POST(request: Request) {
  try {
    console.log('heelo reque');
    const headers = request.headers;
    console.log(headers);
  } catch (error) {
    console.log(error);
  }
}
