export const localStorageGetItem = (item: string) => {
  return localStorage.getItem(item)
}

export const localStorageSetItem = (token: any) => {
  if (token.refresh) {
    localStorage.setItem('refresh', token.refresh)
  }
  if (token.access) {
    localStorage.setItem('access', token.access)
  }
}

export const localStorageRemoveItem = (items: any) => {
  for (const item of items) {
    localStorage.removeItem(item)
  }
}