const getSysEnv = function (url: string): string {
  let sysEnv = 'live';

  sysEnv = url.includes('//pre.') ? 'pre' : sysEnv;
  sysEnv = url.includes('//tui.') ? 'tui' : sysEnv;
  sysEnv = url.includes('//nemo-t.') || url === '' ? 'dev' : sysEnv;

  return sysEnv;
};

export { getSysEnv };
