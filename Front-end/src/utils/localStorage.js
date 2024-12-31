export const getData = (key) => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing JSON data:", e);
      return null;
    }
  }
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
