export async function GET(req: Request) {
    setTimeout(() => {
        fetch(`${process.env.VERCEL_URL}/`);
    }, Number(process.env.RENDER_DOWNTIME) || 1500);  
    return new Response("pong");
}