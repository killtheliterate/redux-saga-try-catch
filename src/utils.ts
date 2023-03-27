export type StandardAction = {
  error?: boolean
  meta?: Record<string, unknown>
  payload?: unknown
  type: string
}

export type DeferredAction = {
  error?: boolean
  payload?: unknown
  type: string

  meta: Record<string, unknown> & {
    deferred: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      failure: (...args: any[]) => void

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (...args: any[]) => void
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StdOut = { stdout: (...args: any[]) => void }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Saga<T, A> = (io: T, action: A) => Iterator<any>
