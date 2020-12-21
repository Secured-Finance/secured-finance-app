export const formatAddress = (address: string, length: number) => {
  return address.slice(0, length) + '...' + address.slice(-4)
}