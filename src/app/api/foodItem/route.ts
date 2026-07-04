import prisma from "@/utils/prisma";
import response from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await prisma.foodItem.findMany();

        return response({
            message: "success",
            status: 200,
            data,
        });
    } catch (error) {
        console.error(error);

        return response({
            message: "error",
            status: 500,
            error,
        });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return response({
                message: "error",
                status: 400,
                error: "Missing id",
            });
        }

        const data = await prisma.foodItem.delete({
            where: {
                id,
            },
        });

        return response({
            message: "success",
            status: 200,
            data,
        })
    } catch (error) {
        console.error(error);

        return response({
            message: "error",
            status: 500,
            error,
        });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body) {
            return response({
                message: "error",
                status: 400,
                error: "Missing body",
            });
        }

        const data = await prisma.foodItem.update({
            where: {
                id: body.id,
            },
            data: {
                name: body.name,
                servingSize: body.servingSize,
                protein_g: body.protein_g,
                carbs_g: body.carbs_g,
                calories_kcal: body.calories_kcal,
            },
        });

        return response({
            message: "success",
            status: 200,
            data:data,
        })
    } catch (error) {
        console.error(error);        

        return response({
            message: "error",
            status: 500,
            error,        
        });
    }
}