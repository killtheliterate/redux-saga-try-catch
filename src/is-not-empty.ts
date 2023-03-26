import { isEmpty } from 'lodash/fp'

export function isNotEmpty<T>(value: T): value is NonNullable<T> {
  return !isEmpty(value)
}
