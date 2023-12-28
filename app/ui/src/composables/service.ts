import { ApiError, ApiErrorResponse, CancelablePromise } from '..'
import { UnwrapRef, ref } from 'vue'

export const useService = async <T>(
  service: Promise<T>
): Promise<{
  data: Ref<T | undefined>
  error: Ref<ApiError | unknown>
  dataLoading: Ref<boolean>
}> => {
  const { logger, correlationId } = useSsrLogger()
  logger.info(`[ui] [useService] correlationId: ${correlationId}`)

  const dataLoading = ref(true)
  const error = ref<ApiError | unknown>()
  const data = ref<T | undefined>()

  try {
    const res = await service
    data.value = res
  } catch (err) {
    if (err instanceof ApiError) {
      error.value = {
        ...err,
        body: JSON.parse(err.body)
      }
    }
  } finally {
    dataLoading.value = false
  }

  return { data, error, dataLoading }
}
