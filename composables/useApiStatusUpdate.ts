export const useApiStatusUpdate = () => {
    const loading = ref(false)
    const error = ref(null)
    const success = ref(false)

    const updateStatus = async ({
        api,
        type,
        id,
        method,
        status
    }: {
        api: string,
        type: string,
        method: string,
        id: string | number
        status: boolean
    }) => {
        loading.value = true
        error.value = null
        success.value = false

        try {
            const response = await useApiFetch(`/${api}/${id}/${type}`, {
                method: method,
                body: {  status } // <- ✅ HERE
            })

            success.value = true
            return response
        } catch (err: any) {
            error.value = err?.data || err.message || 'Failed to update status'
        } finally {
            loading.value = false
        }
    }

    return {
        updateStatus,
        loading,
        error,
        success
    }
}
