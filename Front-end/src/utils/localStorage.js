export const getData = (key) => {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return null;
};

export const setData = (key, data) => {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const delData = (key) => {
  localStorage.removeItem(key);
};
