"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.workflows.getMany.queryOptions({}));

  const create = useMutation(trpc.workflows.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
    },
  }));
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data)}
      <Button
        disabled={create.isPending}
        onClick={() => {
          create.mutate();
        }}
      />
    </div>
  );
}
