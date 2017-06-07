export const loadState = (propName, defaultRes?) => {
  try {
    const state = localStorage.getItem(propName);
    if (state === null) {
      return defaultRes;
    }
    return JSON.parse(state);
  } catch (err) {
    return defaultRes;
  }
};

export const saveState = (value: any, propName) => {
  const ser = JSON.stringify(value);
  localStorage.setItem(propName, ser);
};