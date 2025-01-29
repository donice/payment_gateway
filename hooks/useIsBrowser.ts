
const useIsBrower = () => {
  const isBrowser = typeof window !== 'undefined';
  return isBrowser;
}

export default useIsBrower