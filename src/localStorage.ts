export const loadState = () => {
  try {
    const state = localStorage.getItem('favoriteNodes');
    if (state === null) {
      return [];
    }
    return JSON.parse(state);
  } catch (err) {
    return [];
  }
};

export const saveState = (nodes: any) => {
  const ser = JSON.stringify(nodes);
  localStorage.setItem('favoriteNodes', ser);
};