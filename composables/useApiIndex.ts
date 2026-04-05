export const useApiIndex = ({
  api,
  order_by,
  filters,
  sort,
  key = '',
  lazy = false,
  server = true,
  watch = [],
  params = () => ({}),
}: {
  api: string;
  filters?: Record<string, any>;
  key?: string;
  sort?: string;
  order_by?: string;
  lazy?: boolean;
  server?: boolean;
  watch?: any[];
  params?: () => Record<string, any>;
}) => {
  return useAsyncData(
    key || `api-index-${api}`,
    () =>
      useApiFetch(`/${api}/index`, {
        method: 'POST',
        body: {
          filters: filters,
          orderBy: order_by,
          orderByDirection: sort,
          paginate: true,
          ...params() // 🟢 inject dynamic pagination/search values
        }
      }),
    {
      lazy,
      server,
      watch
    }
  );
};
