export const _setStatus = (
  data: any,
  callback: string,
  isError: boolean = false,
  setStatus: any,
  type: 'TAPSIGNER' | 'SATSCARD' | 'SATOCHIP'
) => {
  const meta = {
    type,
    command: callback,
    response: !isError ? data : null,
    error: isError ? data.toString() : null,
  };
  setStatus(meta);
};
