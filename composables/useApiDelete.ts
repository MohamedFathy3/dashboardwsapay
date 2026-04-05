export const useApiDelete = ({
    api,
    ids = [],
    key = '',
    lazy = false,
    server = true,
    watch = []
  }: {
    api: string;
    ids: (string | number)[];
    key?: string;
    lazy?: boolean;
    server?: boolean;
    watch?: any[];
  }) => {
    return useAsyncData(
      key || `api-delete-${api}`,
      () =>
        useApiFetch(`/${api}/delete`, {
          method: 'DELETE',
          body: {
            ids
          }
        }),
      {
        lazy,
        server,
        watch
      }
    );
  };
  
