import { Apple, Beef, Flame, Plus, Ruler, Wheat } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";

export default function Form({
    Submit,
    register,
    handleSubmit,
    isSubmitting,
    errors,
}: {
    Submit: any;
    register: any;
    isSubmitting: any;
    handleSubmit: any;
    errors: any;
}) {
    return (
        <form onSubmit={handleSubmit(Submit)} className="flex flex-col gap-3 p-1">
            {/* Food item */}
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-container/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-transparent transition-colors">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <Apple size={18} className="text-emerald-500" strokeWidth={2} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                    <label htmlFor="foodItem" className="text-xs font-medium text-muted-foreground">
                        Food item
                    </label>
                    <Input
                        id="foodItem"
                        placeholder="e.g. Grilled chicken breast"
                        {...register("name")}
                        className="h-8  border-b-primary pl-2 text-base font-semibold shadow-none focus-visible:ring-0"
                    />
                    {errors.name?.message && <span className="text-xs font-medium text-rose-600">{errors.name.message}</span>}
                </div>
            </div>

            {/* Serving size */}
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-container/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-transparent transition-colors">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <Ruler size={18} className="text-violet-500" strokeWidth={2} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                    <label htmlFor="servingSize" className="text-xs font-medium text-muted-foreground">
                        Serving size
                    </label>
                    <Input
                        id="servingSize"
                        placeholder="e.g. 1 cup, 150 g"
                        {...register("servingSize")}
                        className="h-8  border-b-primary pl-2 text-base font-semibold shadow-none focus-visible:ring-0"
                    />
                    {errors.servingSize?.message && <span className="text-xs font-medium text-rose-600">{errors.servingSize.message}</span>}
                </div>
            </div>

            {/* Calories */}
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-container/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-transparent transition-colors">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <Flame size={18} className="text-orange-500" strokeWidth={2} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                    <label htmlFor="calories_kcal" className="text-xs font-medium text-muted-foreground">
                        Calories
                    </label>
                    <div className="flex items-baseline gap-1">
                        <Input
                            type="number"
                            step="any"
                            id="calories_kcal"
                            {...register("calories_kcal")}
                            className="h-8 border-b-primary pl-2 text-base font-semibold shadow-none focus-visible:ring-0"
                        />
                        <span className="text-xs text-muted-foreground">kcal</span>
                    </div>
                    {errors.calories_kcal?.message && <span className="text-xs font-medium text-rose-600">{errors.calories_kcal.message}</span>}
                </div>
            </div>

            {/* Protein + Carbs side by side */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-container/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-transparent transition-colors">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                        <Beef size={18} className="text-rose-500" strokeWidth={2} />
                    </span>
                    <div className="flex flex-1 flex-col gap-0.5">
                        <label htmlFor="protein_g" className="text-xs font-medium text-muted-foreground">
                            Protein
                        </label>
                        <div className="flex items-baseline gap-1">
                            <Input
                                type="number"
                                step="any"
                                id="protein_g"
                                {...register("protein_g")}
                                className="h-8 w-full border-b-primary pl-2 text-base font-semibold shadow-none focus-visible:ring-0"
                            />
                            <span className="text-xs text-muted-foreground">g</span>
                        </div>
                        {errors.protein_g?.message && <span className="text-xs font-medium text-rose-600">{errors.protein_g.message}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-container/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-transparent transition-colors">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Wheat size={18} className="text-amber-500" strokeWidth={2} />
                    </span>
                    <div className="flex flex-1 flex-col gap-0.5">
                        <label htmlFor="carbs_g" className="text-xs font-medium text-muted-foreground">
                            Carbs
                        </label>
                        <div className="flex items-baseline gap-1">
                            <Input
                                type="number"
                                step="any"
                                id="carbs_g"
                                {...register("carbs_g")}
                                className="h-8 w-full border-b-primary pl-2 text-base font-semibold shadow-none focus-visible:ring-0"
                            />
                            <span className="text-xs text-muted-foreground">g</span>
                        </div>
                        {errors.carbs_g?.message && <span className="text-xs font-medium text-rose-600">{errors.carbs_g.message}</span>}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] disabled:opacity-60"
            >
                <Plus size={16} />
                {isSubmitting ? "submitting..." : "Done"}
            </button>
        </form>
    );
}
