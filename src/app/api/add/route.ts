import prisma from "@/utils/prisma";
import response from "@/utils/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body) {
            return response({
                message: "error",
                status: 400,
                error: "Missing body",
            });
        }

        const existing = await prisma.foodItem.findFirst({
            where: {
                name: body.name,
            },
        });

        if (existing) {
            return response({
                message: "error",
                status: 400,
                error: "Food item already exists",
            });
        }

        const data = await prisma.foodItem.create({
            data: {
                name: body.name,
                servingSize: body.servingSize,
                protein_g: body.protein_g,
                carbs_g: body.carbs_g,
                calories_kcal: body.calories_kcal,
            },
        });

        // console.log(body);

        return response({
            message: "success",
            status: 200,
            data: data,
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
