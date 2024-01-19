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

export const filterClauses = (filters: any) =>
  Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]: any) =>
      value
        .split(" ")
        .reduce((accumulator: string, currentValue: string, index: number) => {
          return `${accumulator} ${
            index !== 0 ? "AND" : ""
          } ${key} LIKE '%${currentValue}%'`;
        }, "")
    )
    .join(" AND ");
