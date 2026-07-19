export async function GET(req: Request) {
    console.log("ping")
    setTimeout(() => {
        fetch(`${process.env.VERCEL_URL}`);
    }, Number(process.env.RENDER_DOWNTIME) || 1500);  
    return new Response(JSON.stringify({ message: "pong" }), { status: 200 });
}

