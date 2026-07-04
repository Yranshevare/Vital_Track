import { NextResponse } from "next/server";

type Response = {
    message: string;
    status: number;
    data?: any;
    error?: any;
}

export default function response({message, status , data = {}, error}: Response) {
    return NextResponse.json({ message, data, error }, { status: status });
}