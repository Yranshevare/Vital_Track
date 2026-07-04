"use client";
import { CircleUserRound, Beef, Wheat, Flame, Droplet, Pencil, Check, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    Protein_g: z.coerce.number("enter a valid number"),
    Carbs_g: z.coerce.number("enter a valid number"),
    Calories_kcal: z.coerce.number("enter a valid number"),
    fat: z.coerce.number("enter a valid number"),
});

type GoalField = {
    key: keyof z.infer<typeof schema>;
    label: string;
    unit: string;
    icon: React.ElementType;
    accent: string; // tailwind text/bg color token
};

const FIELDS: GoalField[] = [
    { key: "Calories_kcal", label: "Calories", unit: "kcal", icon: Flame, accent: "orange" },
    { key: "Protein_g", label: "Protein", unit: "g", icon: Beef, accent: "rose" },
    { key: "Carbs_g", label: "Carbs", unit: "g", icon: Wheat, accent: "amber" },
    { key: "fat", label: "Fat", unit: "g", icon: Droplet, accent: "sky" },
];

// Maps each accent name to static Tailwind classes (kept literal so the JIT compiler picks them up)
const ACCENT_STYLES: Record<string, { chip: string; icon: string }> = {
    orange: { chip: "bg-orange-50", icon: "text-orange-500" },
    rose: { chip: "bg-rose-50", icon: "text-rose-500" },
    amber: { chip: "bg-amber-50", icon: "text-amber-500" },
    sky: { chip: "bg-sky-50", icon: "text-sky-500" },
};

export default function UserCircle() {
    const [editMode, setEditMode] = useState(false);
    const [userGoals, setUserGoal] = useState<z.infer<typeof schema>>({
        Protein_g: 0,
        Carbs_g: 0,
        Calories_kcal: 0,
        fat: 0,
    });

    useEffect(() => {
        const Goals: z.infer<typeof schema> = JSON.parse(localStorage.getItem("VitalTrackUserGoals") || "{}");
        setUserGoal(Goals);
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema), defaultValues: userGoals });

    useEffect(() => {
        reset(userGoals);
    }, [userGoals, reset]);

    function onSubmit(data: z.infer<typeof schema>) {
        try {
            localStorage.setItem("VitalTrackUserGoals", JSON.stringify(data));
        } catch (error) {
            alert("Error saving data to localstorage");
        } finally {
            setEditMode(false);
        }
    }

    function handleCancel() {
        reset(userGoals);
        setEditMode(false);
    }

    return (
        <Sheet>
            <SheetTrigger className="rounded-full p-1 transition-colors hover:bg-surface-container/70">
                <CircleUserRound className="text-primary" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-0 p-0">
                <SheetHeader className="items-center gap-3 border-b border-border/60 bg-gradient-to-b from-surface-container/60 to-transparent px-6 pb-6 pt-8 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
                        <CircleUserRound size={36} className="text-primary" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-1">
                        <SheetTitle className="text-xl font-semibold tracking-tight">Hey there!</SheetTitle>
                        <SheetDescription className="text-sm text-muted-foreground">Set the daily targets you're aiming to hit</SheetDescription>
                    </div>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col justify-between px-6 py-6">
                    <div className="flex flex-col gap-3">
                        {FIELDS.map(({ key, label, unit, icon: Icon, accent }) => {
                            const styles = ACCENT_STYLES[accent];
                            return (
                                <div
                                    key={key}
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                                        editMode ? "border-primary/40 bg-transparent" : "border-border/60 bg-surface-container/40"
                                    }`}
                                >
                                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${styles.chip}`}>
                                        <Icon size={18} className={styles.icon} strokeWidth={2} />
                                    </span>

                                    <div className="flex flex-1 flex-col gap-0.5">
                                        <label htmlFor={key} className="text-xs font-medium text-muted-foreground">
                                            {label}
                                        </label>

                                        {editMode ? (
                                            <Input
                                                type="number"
                                                step="any"
                                                id={key}
                                                {...register(key)}
                                                autoFocus={key === "Calories_kcal"}
                                                className="h-8 border-0 border-b border-primary/50 !bg-transparent p-0 pl-3 text-base font-semibold shadow-none focus-visible:ring-0 focus-visible:border-primary"
                                            />
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base font-semibold leading-none">{userGoals[key] ?? "—"}</span>
                                                <span className="text-xs text-muted-foreground">{unit}</span>
                                            </div>
                                        )}

                                        {errors[key]?.message && <p className="text-xs font-medium text-rose-600">{errors[key]?.message}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <SheetFooter className="mt-8 flex-row gap-2 p-0">
                        {editMode ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container disabled:opacity-50"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] disabled:opacity-60"
                                >
                                    <Check size={16} />
                                    {isSubmitting ? "Saving…" : "Save"}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditMode(true);
                                }}
                                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
                            >
                                <Pencil size={15} />
                                Edit goals
                            </button>
                        )}
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
