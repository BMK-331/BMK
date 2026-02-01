"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const workflowsQueryOptions = trpc.getWorkflows.queryOptions();
  const { data: workflows } = useQuery(workflowsQueryOptions);

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: workflowsQueryOptions.queryKey,
        });
      },
    }),
  );
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-4">
      <div className="text-sm text-muted-foreground">
        {session?.user?.email ?? "Not signed in"}
      </div>
      <div className="w-full max-w-md">
        <div className="font-medium">Workflows</div>
        <pre className="text-xs bg-muted rounded-md p-3 overflow-auto">
          {JSON.stringify(workflows, null, 2)}
        </pre>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={create.isPending}
          onClick={() => create.mutate({ name: "test-workflow" })}
        >
          Create workflow
        </Button>
        {session && <Button onClick={() => authClient.signOut()}>Logout</Button>}
      </div>
    </div>
  );
}
