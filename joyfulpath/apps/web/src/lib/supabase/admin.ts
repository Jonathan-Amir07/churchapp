export const createAdminClient = () => {
  return {
    auth: {
      admin: {
        deleteUser: async () => ({ error: null as any }),
      }
    },
    from: (table: string) => ({} as any)
  };
};

