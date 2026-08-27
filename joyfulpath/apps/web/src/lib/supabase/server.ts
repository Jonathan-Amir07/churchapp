// Dummy client since we moved to NestJS + Prisma
export async function createClient() {
  return {
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any, options?: any) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://storage.joyfulpath.local/${bucket}/${path}` } }),
        remove: async (paths: string[]) => ({ data: paths, error: null }),
      })
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null as any }),
      signOut: async () => ({ error: null as any }),
      updateUser: async (attributes: any) => ({ data: {}, error: null as any }),
    },
    from: (table: string) => ({} as any)
  };
}

