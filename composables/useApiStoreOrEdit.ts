export const useApiStoreOrEdit = ({
    api,
    key = '',
    lazy = false,
    server = true,
    watch = [],
    params = () => ({}),
    id = null, // Add ID for edit
    method = 'POST', // Default to POST for adding, PUT/PATCH for editing
  }: {
    api: string;
    key?: string;
    lazy?: boolean;
    server?: boolean;
    watch?: any[];
    params?: () => Record<string, any>;
    id?: string | number | null; // To determine if it's store or edit
    method?: 'POST' | 'PATCH'; // Use or PATCH for edit
  }) => {
    // Determine if we're updating (edit) or creating (store)
    const endpoint = id ? `/${api}/${id}` : `/${api}`;
    
    return useAsyncData(
      key || `api-${api}-${id ? 'edit' : 'store'}`,
      () =>
        useApiFetch(endpoint, {
          method,
          body: {
            ...params(), // Inject dynamic form values
          }
        }),
      {
        lazy,
        server,
        watch
      }
    );
  };
  
