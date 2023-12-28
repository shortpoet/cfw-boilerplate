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

export const useServiceQuery = async <T extends Record<string, any>>(
  service: CancelablePromise<T>,
  queryKey: keyof T
): Promise<{
  data: Ref<T[keyof T] | undefined>
  error: Ref<ApiError | unknown>
  dataLoading: Ref<boolean>
}> => {
  const { logger, correlationId } = useSsrLogger()
  logger.info(`[ui] [useService] correlationId: ${correlationId}`)

  const dataLoading = ref(true)
  const error = ref<ApiError | unknown>()
  const data = ref<T[keyof T] | undefined>() // Define data as T[keyof T] | undefined

  try {
    const res = await service

    if (res && queryKey in res) {
      // Use type assertion to tell TypeScript that data.value is of type T[keyof T]
      data.value = res[queryKey] as T[keyof T]
    } else {
      throw new Error(`Key "${String(queryKey)}" not found in response`)
    }
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
