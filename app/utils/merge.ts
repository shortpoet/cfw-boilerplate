export const merge3 = (a: Record<string, any>, b: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const key in a) {
    result[key] = a[key];
  }
  for (const key in b) {
    result[key] = b[key];
  }
  return result;
};

export const merge2 = (a: any, b: any) => {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }
  if (typeof a === 'object' && typeof b === 'object') {
    return { ...a, ...b };
  }
  return b;
};

export const merge = (a: any, b: any) => {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};
