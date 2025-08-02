
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useQuery, useMutation, useQueryClient } from "react-query";

export function useTimerAPI() {
  const fetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
    
  // Fetch all timers
  const useTimers = () => {
    return useQuery("timers", async () => {
      const response = await fetch("/api/timers");
      if (!response.ok) {
        throw new Error("Failed to fetch timers");
      }
      return response.json();
    });
  };

  // Fetch single timer
  const useTimer = (id) => {
    return useQuery(
      ["timer", id],
      async () => {
        const response = await fetch(`/api/timers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch timer");
        }
        return response.json();
      },
      {
        enabled: !!id,
      }
    );
  };

  // Create timer mutation
  const useCreateTimer = () => {
    return useMutation(
      async (timerData) => {
        const response = await fetch("/api/timers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(timerData),
        });
        if (!response.ok) {
          throw new Error("Failed to create timer");
        }
        return response.json();
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("timers");
        },
      }
    );
  };

  // Update timer mutation
  const useUpdateTimer = () => {
    return useMutation(
      async ({ id, ...timerData }) => {
        const response = await fetch(`/api/timers/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(timerData),
        });
        if (!response.ok) {
          throw new Error("Failed to update timer");
        }
        return response.json();
      },
      {
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries("timers");
          queryClient.invalidateQueries(["timer", variables.id]);
        },
      }
    );
  };

  // Delete timer mutation
  const useDeleteTimer = () => {
    return useMutation(
      async (id) => {
        const response = await fetch(`/api/timers/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete timer");
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("timers");
        },
      }
    );
  };

  // Toggle timer active status
  const useToggleTimer = () => {
    return useMutation(
      async ({ id, active }) => {
        const response = await fetch(`/api/timers/${id}/activate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active }),
        });
        if (!response.ok) {
          throw new Error("Failed to toggle timer status");
        }
        return response.json();
      },
      {
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries("timers");
          queryClient.invalidateQueries(["timer", variables.id]);
        },
      }
    );
  };

  return {
    useTimers,
    useTimer,
    useCreateTimer,
    useUpdateTimer,
    useDeleteTimer,
    useToggleTimer,
  };
}