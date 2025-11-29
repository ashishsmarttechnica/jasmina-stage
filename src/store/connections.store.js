import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useConnectionsStore = create(
  devtools(
    (set) => ({
      connections: [],
      pagination: null,
      hasMore: true,

      setConnections: (connections) => set({ connections }),
      setPagination: (pagination) => set({ pagination }),
      setHasMore: (hasMore) => set({ hasMore }),

      // Add a new connection to the beginning of the list
      addConnection: (newConnection) =>
        set((state) => ({
          connections: [newConnection, ...state.connections],
        })),

      // Remove a connection
      removeConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter((conn) => conn.connectionId !== connectionId),
        })),

      // Reset store
      resetConnections: () =>
        set({
          connections: [],
          pagination: null,
          hasMore: true,
        }),
    }),
    { name: "ConnectionsStore" }
  )
);

export default useConnectionsStore;

export const useCompanyConnectionsStore = create(
  devtools(
    (set) => ({
      connections: [],
      pagination: null,
      hasMore: true,

      setConnections: (connections) => set({ connections }),
      setPagination: (pagination) => set({ pagination }),
      setHasMore: (hasMore) => set({ hasMore }),

      // Add a new connection to the beginning of the list
      addConnection: (newConnection) =>
        set((state) => ({
          connections: [newConnection, ...state.connections],
        })),

      // Remove a connection
      removeConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter((conn) => conn.connectionId !== connectionId),
        })),

      // Reset store
      resetConnections: () =>
        set({
          connections: [],
          pagination: null,
          hasMore: true,
        }),
    }),
    { name: "CompanyConnectionsStore" }
  )
);

export const useOthersCompanyConnectionsStore = create(
  devtools(
    (set) => ({
      connections: [],
      pagination: null,
      hasMore: true,

      setConnections: (connections) => set({ connections }),
      setPagination: (pagination) => set({ pagination }),
      setHasMore: (hasMore) => set({ hasMore }),

      addConnection: (newConnection) =>
        set((state) => ({
          connections: [newConnection, ...state.connections],
        })),

      removeConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter((conn) => conn.connectionId !== connectionId),
        })),

      resetConnections: () =>
        set({
          connections: [],
          pagination: null,
          hasMore: true,
        }),
    }),
    { name: "OthersCompanyConnectionsStore" }
  )
);
