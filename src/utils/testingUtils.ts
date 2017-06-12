export const node = (text: string, props?: {}) => ({id: text, text, ...props});

export const join = (arr: any[]) =>
  arr.reduce((acc, item) => acc.concat(['child', item]), [])
    .splice(1);
