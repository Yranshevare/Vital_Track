export async function GET(req: Request) {
    setTimeout(() => {
        console.log("ping")
        fetch(`${process.env.VERCEL_URL}`);
    }, Number(process.env.RENDER_DOWNTIME) || 1500);  
    return new Response("pong");
}