import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useInvalidate } from "@/lib/invalidate";
import { foodListKey } from "@/app/constant";
import Form from "./fom";

const schema = z.object({
    name: z.string().min(1, "enter a food name"),
    servingSize: z.string().min(1, "enter a serving size"),
    protein_g: z.coerce.number("enter a valid number").min(0, "must be 0 or more"),
    carbs_g: z.coerce.number("enter a valid number").min(0, "must be 0 or more"),
    calories_kcal: z.coerce.number("enter a valid number").min(0, "must be 0 or more"),
});

export type FoodEntry = z.infer<typeof schema>;

export default function AddFoodForm({ closeDialog }: { closeDialog: () => void }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            servingSize: "",
            protein_g: "",
            carbs_g: "",
            calories_kcal: "",
        },
    });

    const invalidate = useInvalidate();

    async function Submit(data: FoodEntry) {
        try {
            const res = await axios.post("/api/add", data);
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
