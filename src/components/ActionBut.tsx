import FoodEntry from "@/Types/FoodEntry";
import { SquarePen, Trash2 } from "lucide-react";
import React from "react";
import axios from "axios";
import { useInvalidate } from "@/lib/invalidate";
import { foodListKey } from "@/app/constant";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import UpdateFoodForm from "./UpdateFoodFom";

export default function ActionBut({ Item }: { Item: FoodEntry }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const invalidate = useInvalidate();
    async function handleDelete() {
        try {
            const res = await axios.delete(`/api/foodItem?id=${Item.id}`);
            console.log(res.data);
            await invalidate(foodListKey);
        } catch (error) {
            console.error(error);
        }
    }
    // console.log(Item);

    return (
        <div className="flex  justify-between items-center">
            <button onClick={handleDelete}>
                <Trash2 className="text-red-500" />
            </button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>
                    <SquarePen className="text-blue-500" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Food</DialogTitle>
                        <DialogDescription>
                            <UpdateFoodForm closeDialog={() => setIsDialogOpen(false)} food={Item}  />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
