export const formatObjectWithPrefix = (prefix: string) => (obj: any) => {
  const category: any = {};
  for (const key in obj) {
    if (key.startsWith(prefix)) {
      category[key.replace(prefix, "")] = obj[key];
      delete obj[key];
    }
  }
  obj.category = category;
  return obj;
};
