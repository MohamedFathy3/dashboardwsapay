export const useApiItem = ({
    api,
    id,
    key = '',
    lazy = false,
    server = true,
    watch = []
  }: {
    api: string;
    id: string | number;
    key?: string;
    lazy?: boolean;
    server?: boolean;
    watch?: any[];
  }) => {
    return useAsyncData(
      key || `api-item-${api}-${id}`,
      () =>
        useApiFetch(`/${api}/${id}`, {
          method: 'GET'
        }),
      {
        lazy,
        server,
        watch
      }
    );
  };
  
