import prisma from "@/utils/prisma";
import response from "@/utils/response";
import { NextRequest } from "next/server";

type FoodData = {
    foodItem: string;
    servingSize: string;
    protein_g: number;
    carbs_g: number;
    calories_kcal: number;
};

export async function POST(req: NextRequest) {
    try {
        const body: FoodData[] = await req.json();

        if (!Array.isArray(body) || body.length === 0) {
            return response({
                message: "error",
                status: 400,
                error: "Request body must be a non-empty array.",
            });
        }

        // Get existing food names
        const existingFoods = await prisma.foodItem.findMany({
            select: {
                name: true,
            },
        });

        const existingNames = new Set(existingFoods.map((food) => food.name));

        // Keep only foods that don't already exist
        const foodsToInsert = body
            .filter((item) => !existingNames.has(item.foodItem))
            .map((item) => ({
                name: item.foodItem,
                servingSize: item.servingSize,
                protein_g: item.protein_g,
                carbs_g: item.carbs_g,
                calories_kcal: item.calories_kcal,
            }));

        if (foodsToInsert.length > 0) {
            await prisma.foodItem.createMany({
                data: foodsToInsert,
            });
        }

        return response({
            message: "success",
            status: 201,
            data: {
                inserted: foodsToInsert.length,
                skipped: body.length - foodsToInsert.length,
            },
        });
    } catch (error) {
        console.error(error);

        return response({
            message: "error",
            status: 500,
            error: "Internal Server Error",
        });
    }
}