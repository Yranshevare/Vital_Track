import { Apple, Ruler, Flame, Beef, Wheat, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useInvalidate } from "@/lib/invalidate";
import { foodListKey } from "@/app/constant";
import type FoodEntry from "@/Types/FoodEntry";
import Form from "./fom";

const schema = z.object({
    name: z.string().min(1, "enter a food name"),
    servingSize: z.string().min(1, "enter a serving size"),
    protein_g: z.coerce.number("enter a valid number").min(0, "must be 0 or more"),
    carbs_g: z.coerce.number("enter a valid number").min(0, "must be 0 or more"),
    calories_kcal: z.coerce.number("enter a valid number").min(0, "must be 0 or more"),
});

export default function UpdateFoodForm({ closeDialog, food }: { food: FoodEntry; closeDialog: () => void }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: food.name,
            servingSize: food.servingSize,
            protein_g: food.protein_g,
            carbs_g: food.carbs_g,
            calories_kcal: food.calories_kcal,
        },
    });

    const invalidate = useInvalidate();

    async function Submit(data: z.infer<typeof schema>) {
        try {
            const res = await axios.put("/api/foodItem", { ...data, id: food.id });
            console.log(res.data);
            await invalidate(foodListKey);
            closeDialog();
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError("name", { type: "server", message: error.response?.data?.error || "Unexpected error occurred" });
                console.log(error.response?.data);
            } else {
                alert("Unexpected error");
                console.error(error);
            }
            return;
        }
        reset();
    }

    return <Form handleSubmit={handleSubmit} Submit={Submit} isSubmitting={isSubmitting} errors={errors} register={register} />;
}
