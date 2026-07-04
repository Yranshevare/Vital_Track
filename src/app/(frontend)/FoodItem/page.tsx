"use client";
import { foodListKey } from "@/app/constant";
import ActionBut from "@/components/ActionBut";
import AddFoodForm from "@/components/AddFoodForm";
import Loading from "@/components/Loading";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type FoodEntry from "@/Types/FoodEntry";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";



// const foods: FoodEntry[] = [
//     {
//         foodItem: "Boiled Egg",
//         servingSize: "1 large",
//         protein_g: 6,
//         carbs_g: 0.5,
//         calories_kcal: 70,
//     },
//     {
//         foodItem: "Fried Egg",
//         servingSize: "1 large",
//         protein_g: 6,
//         carbs_g: 0.5,
//         calories_kcal: 90,
//     },
//     {
//         foodItem: "Dal (cooked)",
//         servingSize: "1 bowl (~200 g)",
//         protein_g: 11,
//         carbs_g: 27,
//         calories_kcal: 200,
//     },
//     {
//         foodItem: "Rajma (cooked)",
//         servingSize: "1 bowl (~200 g)",
//         protein_g: 15,
//         carbs_g: 42,
//         calories_kcal: 275,
//     },
//     {
//         foodItem: "Sprouts (moong, mixed)",
//         servingSize: "1 bowl (~100 g)",
//         protein_g: 8,
//         carbs_g: 16,
//         calories_kcal: 110,
//     },
//     {
//         foodItem: "Peanuts",
//         servingSize: "1 bowl (~50 g)",
//         protein_g: 12.5,
//         carbs_g: 9,
//         calories_kcal: 290,
//     },
//     {
//         foodItem: "Rice (cooked)",
//         servingSize: "1 bowl (~150 g)",
//         protein_g: 3.5,
//         carbs_g: 42.5,
//         calories_kcal: 190,
//     },
//     {
//         foodItem: "Chapati",
//         servingSize: "1 medium",
//         protein_g: 3,
//         carbs_g: 16.5,
//         calories_kcal: 90,
//     },
//     {
//         foodItem: "Banana",
//         servingSize: "1 medium",
//         protein_g: 1,
//         carbs_g: 26,
//         calories_kcal: 105,
//     },
//     { foodItem: "Milk", servingSize: "250 ml", protein_g: 8, carbs_g: 12, calories_kcal: 150 },
//     {
//         foodItem: "Curd",
//         servingSize: "1 bowl (~200 g)",
//         protein_g: 9,
//         carbs_g: 9,
//         calories_kcal: 120,
//     },
//     { foodItem: "Paneer", servingSize: "100 g", protein_g: 19, carbs_g: 3, calories_kcal: 280 },
//     {
//         foodItem: "Chicken Breast",
//         servingSize: "100 g",
//         protein_g: 30.5,
//         carbs_g: 0,
//         calories_kcal: 170,
//     },
//     {
//         foodItem: "Soy Chunks (dry)",
//         servingSize: "100 g",
//         protein_g: 52,
//         carbs_g: 33,
//         calories_kcal: 345,
//     },
//     { foodItem: "Oats", servingSize: "100 g", protein_g: 13, carbs_g: 66, calories_kcal: 385 },
//     {
//         foodItem: "Peanut Butter",
//         servingSize: "1 tbsp (~16 g)",
//         protein_g: 4,
//         carbs_g: 3,
//         calories_kcal: 95,
//     },
//     {
//         foodItem: "Vada Pav",
//         servingSize: "1 piece",
//         protein_g: 7,
//         carbs_g: 37.5,
//         calories_kcal: 300,
//     },
//     {
//         foodItem: "Samosa",
//         servingSize: "1 medium",
//         protein_g: 4.5,
//         carbs_g: 32.5,
//         calories_kcal: 275,
//     },
//     {
//         foodItem: "Chicken Shawarma Roll",
//         servingSize: "1 roll",
//         protein_g: 22.5,
//         carbs_g: 45,
//         calories_kcal: 525,
//     },
//     {
//         foodItem: "Misal Pav",
//         servingSize: "1 plate",
//         protein_g: 13.5,
//         carbs_g: 55,
//         calories_kcal: 450,
//     },
//     {
//         foodItem: "Pav Bhaji",
//         servingSize: "1 plate",
//         protein_g: 9,
//         carbs_g: 65,
//         calories_kcal: 525,
//     },
//     {
//         foodItem: "Plain Dosa",
//         servingSize: "1 large",
//         protein_g: 5.5,
//         carbs_g: 37.5,
//         calories_kcal: 200,
//     },
//     {
//         foodItem: "Masala Dosa",
//         servingSize: "1 large",
//         protein_g: 8,
//         carbs_g: 47.5,
//         calories_kcal: 350,
//     },
//     {
//         foodItem: "Veg Biryani",
//         servingSize: "1 plate",
//         protein_g: 12.5,
//         carbs_g: 90,
//         calories_kcal: 600,
//     },
//     {
//         foodItem: "Maggi",
//         servingSize: "1 packet",
//         protein_g: 7.5,
//         carbs_g: 52.5,
//         calories_kcal: 375,
//     },
//     {
//         foodItem: "Dairy Milk (₹10, ~20 g)",
//         servingSize: "1 bar",
//         protein_g: 1.5,
//         carbs_g: 13,
//         calories_kcal: 105,
//     },
//     {
//         foodItem: "Crispello (₹10, ~18 g)",
//         servingSize: "1 pack",
//         protein_g: 1.5,
//         carbs_g: 11,
//         calories_kcal: 95,
//     },
//     {
//         foodItem: "5 Star (₹10, ~22 g)",
//         servingSize: "1 bar",
//         protein_g: 1.5,
//         carbs_g: 15,
//         calories_kcal: 105,
//     },
//     {
//         foodItem: "KitKat (₹10, ~18 g)",
//         servingSize: "1 bar",
//         protein_g: 1.5,
//         carbs_g: 11,
//         calories_kcal: 95,
//     },
//     {
//         foodItem: "Masala Corn (2 tbsp oil)",
//         servingSize: "1 bowl (~150 g corn)",
//         protein_g: 4.5,
//         carbs_g: 30,
//         calories_kcal: 380,
//     },
//     {
//         foodItem: "Veg Manchurian Chili",
//         servingSize: "6-7 pieces (~₹40 serving)",
//         protein_g: 5.5,
//         carbs_g: 35,
//         calories_kcal: 325,
//     },
// ];

export default function page() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // const [foodList, setFoodList] = useState<FoodEntry[]>();

    const { data, isLoading, isError } = useQuery({
        queryKey: [foodListKey],
        queryFn: async () => {
            return axios.get("/api/foodItem").then((res) => res.data.data);
        },
    });

    const filteredFoods = useMemo(() => {
        if (!data) return [];

        const normalizedQuery = searchTerm.trim().toLowerCase();

        if (!normalizedQuery) return data;

        return data.filter((item: FoodEntry) => {
            const haystack = `${item.name} ${item.servingSize}`.toLowerCase();

            return (
                item.name.toLowerCase().includes(normalizedQuery) ||
                item.servingSize.toLowerCase().includes(normalizedQuery) ||
                haystack.includes(normalizedQuery)
            );
        });
    }, [data, searchTerm]);

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-background text-on-surface antialiased ">
            <div className="p-5 flex justify-between items-center">
                <h1 className="text-3xl md:text-4xl font-semibold text-primary ">Available Foods</h1>
                <div className="bg-primary flex items-center justify-center text-white px-3 py-2 rounded-lg">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger>
                            <Plus />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Food</DialogTitle>
                                <DialogDescription>
                                    <AddFoodForm closeDialog={() => setIsDialogOpen(false)} />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="relative flex-1 m-5 flex items-center justify-center">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    <Search />
                </span>
                <input
                    className="w-full pl-12 pr-4 py-4  bg-surface-container-low  rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all border border-primary"
                    list="food-list"
                    placeholder="Search foods or serving sizes"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant text-sm font-semibold">
                            <th className="px-8 py-4">Food Item</th>
                            <th className="px-4 py-4 text-right">Serving Size</th>
                            <th className="px-4 py-4 text-right">Calories</th>
                            <th className="px-4 py-4 text-right">Protein</th>
                            <th className="px-4 py-4 text-right">Carbs</th>
                            <th className="px-8 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {filteredFoods.length === 0 ? (
                            <tr>
                                <td className="px-8 py-6 text-on-surface-variant" colSpan={6}>
                                    No foods match your search. Try a different keyword.
                                </td>
                            </tr>
                        ) : (
                            filteredFoods.map((item: FoodEntry) => (
                                <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                                    <td className="px-8 py-4 font-medium">{item.name}</td>
                                    <td className="px-4 py-4 text-right font-medium">{item.servingSize}</td>
                                    <td className="px-4 py-4 text-right">{Math.round(item.calories_kcal)} kcal</td>
                                    <td className="px-4 py-4 text-right">{Math.round(item.protein_g)}g</td>
                                    <td className="px-4 py-4 text-right">{Math.round(item.carbs_g)}g</td>
                                    <td className="px-4 py-4 text-right">
                                        <ActionBut Item={item} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
