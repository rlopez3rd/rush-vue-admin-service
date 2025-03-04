export const debounce = (cb: () => void, delay = 1000) => {
  let timeout: any

  return (...args: []) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

export const startWithNine = (value: number) => {
  while (value >= 10) {
    value /= 10
  }

  return Math.floor(value) === 9
}
