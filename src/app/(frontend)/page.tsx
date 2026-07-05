"use client";

import UserCircle from "@/components/UserCircle";
import { useQuery } from "@tanstack/react-query";
import {Hamburger, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { foodListKey } from "../constant";
import axios from "axios";
import Loading from "@/components/Loading";
import type FoodEntry from "@/Types/FoodEntry";

type LoggedItem = {
    id: string;
    name: string;
    servingSize: string;
    qty: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

// const goals = { calories: 2700, protein: 110, carbs: 300, fat: 70 };

function findFoodByQuery(query: string, foodList: FoodEntry[]) {
    if (!query) return null;
    const normalized = query.trim().toLowerCase();
    let found = foodList.find((food) => food.name.toLowerCase() === normalized || `${food.name} (${food.servingSize})`.toLowerCase() === normalized);
    if (found) return found;
    found = foodList.find((food) => normalized.includes(food.name.toLowerCase()) || food.name.toLowerCase().includes(normalized));
    if (found) return found;
    return foodList.find((food) => food.name.toLowerCase().startsWith(normalized)) ?? null;
}

export default function Page() {
    const [loggedItems, setLoggedItems] = useState<LoggedItem[]>([]);
    const [foodInput, setFoodInput] = useState("");
    const [qtyInput, setQtyInput] = useState("1");
    const [goals, setGoals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

    const {
        data: foods,
        isLoading,
        isError,
    } = useQuery<FoodEntry[]>({
        queryKey: [foodListKey],
        queryFn: async () => await axios.get("/api/foodItem").then((res) => res.data.data),
    });

    console.log(foods);

    useEffect(() => {
        const goal = JSON.parse(localStorage.getItem("VitalTrackUserGoals") || '{"Calories_kcal":0,"Protein_g":0,"Carbs_g":0,"fat":0}');
        console.log(goal);
        const data = {
            calories: goal.Calories_kcal,
            protein: goal.Protein_g,
            carbs: goal.Carbs_g,
            fat: goal.fat,
        };
        setGoals(data);
    }, []);

    const totals = useMemo(() => {
        return loggedItems.reduce(
            (acc, item) => ({
                calories: acc.calories + item.calories,
                protein: acc.protein + item.protein,
                carbs: acc.carbs + item.carbs,
                fat: acc.fat + item.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    }, [loggedItems]);

    useEffect(() => {
        const logo = document.querySelector(".logo-bounce");
        if (logo) {
            requestAnimationFrame(() => logo.classList.add("animate"));
        }

        const animated = document.querySelectorAll(".will-animate");
        animated.forEach((element, index) => {
            window.setTimeout(() => element.classList.add("animate"), index * 80 + 120);
        });

        const handleMove = (event: MouseEvent) => {
            const moveX = (event.clientX - window.innerWidth / 2) * 0.005;
            const moveY = (event.clientY - window.innerHeight / 2) * 0.005;
            document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    const addFood = () => {
        const trimmedInput = foodInput.trim();
        const qty = Math.max(0.1, Number.parseFloat(qtyInput) || 1);

        if (!trimmedInput) return;

        const found = findFoodByQuery(trimmedInput, foods ?? []);
        if (!found) {
            alert("Food not found. Try a different name from suggestions.");
            return;
        }

        const avgCal = found.calories_kcal;
        const avgProt = found.protein_g;
        const avgCarb = found.carbs_g;
        const avgFat = Math.round((avgCal - (avgProt * 4 + avgCarb * 4)) / 9 || 0);

        const existing = loggedItems.find((item) => item.name === found.name && item.servingSize === found.servingSize);

        if (existing) {
            setLoggedItems((prev) =>
                prev.map((item) => {
                    if (item.id !== existing.id) return item;
                    const nextQty = item.qty + qty;
                    return {
                        ...item,
                        qty: nextQty,
                        calories: avgCal * nextQty,
                        protein: avgProt * nextQty,
                        carbs: avgCarb * nextQty,
                        fat: avgFat * nextQty,
                    };
                })
            );
        } else {
            setLoggedItems((prev) => [
                ...prev,
                {
                    id: `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    name: found.name,
                    servingSize: found.servingSize,
                    qty,
                    calories: avgCal * qty,
                    protein: avgProt * qty,
                    carbs: avgCarb * qty,
                    fat: avgFat * qty,
                },
            ]);
        }

        setFoodInput("");
        setQtyInput("1");
    };

    const removeFood = (id: string) => {
        setLoggedItems((prev) => prev.filter((item) => item.id !== id));
    };

    const calPct = Math.min(100, Math.round((totals.calories / goals.calories || 1) * 100));
    const protPct = Math.min(100, Math.round((totals.protein / goals.protein || 1) * 100));
    const carbPct = Math.min(100, Math.round((totals.carbs / goals.carbs || 1) * 100));
    const circumference = 251.2;

    const proteinCal = totals.protein * 4;
    const carbsCal = totals.carbs * 4;
    const fatCal = totals.fat * 9;
    const totalMacroCal = proteinCal + carbsCal + fatCal;
    const protMacroPct = totalMacroCal > 0 ? Math.round((proteinCal / totalMacroCal) * 100) : 0;
    const carbMacroPct = totalMacroCal > 0 ? Math.round((carbsCal / totalMacroCal) * 100) : 0;
    const fatMacroPct = totalMacroCal > 0 ? Math.round((fatCal / totalMacroCal) * 100) : 0;

    if(isLoading) return <Loading />

    return (
        <main className="min-h-screen bg-background text-on-surface antialiased">
            <header className="bg-white/70 backdrop-blur-xl fixed top-0 w-full z-50 flex justify-between items-center px-5 md:px-10 py-4 max-w-full">
                <div className="text-3xl md:text-4xl font-semibold text-primary tracking-tight logo-bounce will-animate">VitalTrack</div>
                <div className="flex items-center space-x-2">
                    <Link
                        href="/FoodItem"
                        className="w-8 h-8 flex justify-center items-center material-symbols-outlined text-on-surface-variant cursor-pointer"
                    >
                        <Hamburger />
                    </Link>
                    <span className="w-8 h-8 material-symbols-outlined text-on-surface-variant cursor-pointer">
                        <UserCircle />
                    </span>
                </div>
            </header>

            <section className="pt-32 pb-24 px-5 md:px-10 max-w-7xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 flex flex-col space-y-4">
                        <div className="glass-card p-8 rounded-xl shadow-sm space-y-4 will-animate">
                            <h2 className="text-2xl font-semibold text-on-surface">Track Your Intake</h2>
                            <p className="text-on-surface-variant">Enter your meal to calculate a nutritional breakdown instantly.</p>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                                        <Search />
                                    </span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4  bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                        list="food-list"
                                        placeholder="e.g., 200g Grilled Chicken or 1 Avocado"
                                        value={foodInput}
                                        onChange={(event) => setFoodInput(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                addFood();
                                            }
                                        }}
                                    />
                                    <datalist id="food-list">
                                        {foods?.map((food) => (
                                            <option key={`${food.name}-${food.servingSize}`} value={`${food.name} (${food.servingSize})`} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <div className="flex lg:w-auto w-full items-center gap-2">
                                        <p className="text-sm">Qty:</p>
                                        <input
                                            className="lg:w-20 w-full px-4 py-4  bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-center"
                                            type="number"
                                            min="1"
                                            value={qtyInput}
                                            onChange={(event) => setQtyInput(event.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="bg-primary w-full sm:w-auto text-on-primary px-8 py-4 rounded-lg font-medium hover:shadow-lg active:scale-95 transition-all whitespace-nowrap"
                                        onClick={addFood}
                                    >
                                        Add to Log
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden rounded-xl shadow-sm will-animate">
                            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                                <h3 className="text-2xl font-semibold">Today&apos;s Log</h3>
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">{loggedItems.length} Items Logged</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low text-on-surface-variant text-sm font-semibold">
                                            <th className="px-8 py-4">Food Item</th>
                                            <th className="px-4 py-4 text-right">Qty</th>
                                            <th className="px-4 py-4 text-right">Calories</th>
                                            <th className="px-4 py-4 text-right">Protein</th>
                                            <th className="px-4 py-4 text-right">Carbs</th>
                                            <th className="px-8 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {loggedItems.length === 0 ? (
                                            <tr>
                                                <td className="px-8 py-6 text-on-surface-variant" colSpan={6}>
                                                    No food logged yet. Add your first meal to begin tracking.
                                                </td>
                                            </tr>
                                        ) : (
                                            loggedItems.map((item) => (
                                                <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                                                    <td className="px-8 py-4 font-medium">
                                                        {item.name}
                                                        <span className="block text-xs text-on-surface-variant">{item.servingSize}</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-medium">{item.qty.toFixed(2)}x</td>
                                                    <td className="px-4 py-4 text-right">{Math.round(item.calories)} kcal</td>
                                                    <td className="px-4 py-4 text-right">{Math.round(item.protein)}g</td>
                                                    <td className="px-4 py-4 text-right">{Math.round(item.carbs)}g</td>
                                                    <td className="px-8 py-4 text-right">
                                                        <button
                                                            className="text-error hover:bg-error-container/20 p-2 rounded-full transition-colors"
                                                            onClick={() => removeFood(item.id)}
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                <Trash2 />
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-surface-container/50 font-semibold text-primary">
                                            <td className="px-8 py-6">Total Intake</td>
                                            <td className="px-4 py-6 text-right">-</td>
                                            <td className="px-4 py-6 text-right">{Math.round(totals.calories)} kcal</td>
                                            <td className="px-4 py-6 text-right">{Math.round(totals.protein)}g</td>
                                            <td className="px-4 py-6 text-right">{Math.round(totals.carbs)}g</td>
                                            <td className="px-8 py-6" />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-4">
                        <div className="glass-card p-8 rounded-xl shadow-sm text-center will-animate">
                            <h3 className="text-2xl font-semibold text-on-surface mb-8">Daily Progress</h3>
                            <div className="flex flex-col items-center gap-10">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle
                                            className="text-surface-container-highest"
                                            cx="50"
                                            cy="50"
                                            fill="transparent"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                        />
                                        <circle
                                            className="text-primary progress-ring__circle"
                                            cx="50"
                                            cy="50"
                                            fill="transparent"
                                            r="40"
                                            stroke="currentColor"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference * (1 - calPct / 100)}
                                            strokeLinecap="round"
                                            strokeWidth="10"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="font-bold text-2xl text-primary">{calPct}%</span>
                                        <span className="text-sm text-on-surface-variant">Calories</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 w-full">
                                    <div className="relative">
                                        <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100">
                                            <circle
                                                className="text-surface-container-highest"
                                                cx="50"
                                                cy="50"
                                                fill="transparent"
                                                r="40"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                className="text-secondary progress-ring__circle"
                                                cx="50"
                                                cy="50"
                                                fill="transparent"
                                                r="40"
                                                stroke="currentColor"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - protPct / 100)}
                                                strokeLinecap="round"
                                                strokeWidth="8"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="font-bold text-sm text-secondary">{protPct}%</span>
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Protein</span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100">
                                            <circle
                                                className="text-surface-container-highest"
                                                cx="50"
                                                cy="50"
                                                fill="transparent"
                                                r="40"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                className="text-primary-fixed-dim progress-ring__circle"
                                                cx="50"
                                                cy="50"
                                                fill="transparent"
                                                r="40"
                                                stroke="currentColor"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - carbPct / 100)}
                                                strokeLinecap="round"
                                                strokeWidth="8"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="font-bold text-sm text-primary-fixed-dim">{carbPct}%</span>
                                            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Carbs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-xl shadow-sm will-animate">
                            <h3 className="text-2xl font-semibold text-on-surface mb-6">Macro Distribution</h3>
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <circle
                                            id="macro-prot"
                                            cx="18"
                                            cy="18"
                                            fill="transparent"
                                            r="16"
                                            stroke="#4b41e1"
                                            strokeDasharray={`${protMacroPct} 100`}
                                            strokeDashoffset="0"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            id="macro-carb"
                                            cx="18"
                                            cy="18"
                                            fill="transparent"
                                            r="16"
                                            stroke="#00a3a3"
                                            strokeDasharray={`${carbMacroPct} 100`}
                                            strokeDashoffset={-protMacroPct}
                                            strokeWidth="4"
                                        />
                                        <circle
                                            id="macro-fat"
                                            cx="18"
                                            cy="18"
                                            fill="transparent"
                                            r="16"
                                            stroke="#f59e0b"
                                            strokeDasharray={`${fatMacroPct} 100`}
                                            strokeDashoffset={-(protMacroPct + carbMacroPct)}
                                            strokeWidth="4"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-secondary" /> Protein ({protMacroPct}%)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-[#00a3a3]" /> Carbs ({carbMacroPct}%)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-amber-500" /> Fats ({fatMacroPct}%)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-xl shadow-sm bg-surface-container-lowest will-animate">
                            <h3 className="text-2xl font-semibold text-on-surface mb-6">Goal Breakdown</h3>

                            <table className="w-full text-center">
                                <thead>
                                    <tr className="border-b border-outline-variant/20">
                                        <th className="pb-3 font-medium text-on-surface"></th>
                                        <th className="pb-3 text-sm font-medium uppercase tracking-wider text-on-surface-variant">Goal</th>
                                        <th className="pb-3 text-sm font-medium uppercase tracking-wider text-primary">Remaining</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-outline-variant/10">
                                    <tr>
                                        <td className="py-3 text-left text-on-surface">Calories</td>
                                        <td className="py-3 font-medium">{goals.calories.toLocaleString()}</td>
                                        <td className="py-3 font-bold text-primary">
                                            {Math.max(0, goals.calories - totals.calories).toLocaleString()}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-3 text-left text-on-surface">Protein</td>
                                        <td className="py-3 font-medium">{goals.protein}g</td>
                                        <td className="py-3 font-bold text-primary">{Math.max(0, goals.protein - totals.protein)}g</td>
                                    </tr>

                                    <tr>
                                        <td className="py-3 text-left text-on-surface">Carbs</td>
                                        <td className="py-3 font-medium">{goals.carbs}g</td>
                                        <td className="py-3 font-bold text-primary">{Math.max(0, goals.carbs - totals.carbs)}g</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
