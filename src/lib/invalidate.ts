import { useQueryClient } from "@tanstack/react-query";

export function useInvalidate() {
    const queryClient = useQueryClient();

    return async (key: string) => {
        await queryClient.invalidateQueries({
            queryKey: [key],
        });
    };
}
