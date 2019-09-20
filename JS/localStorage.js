// 获取localStorage
export const getLocalStorage = value => {
  let defaultValue = null;
  const localSearchParams = localStorage.getItem(value);
  if (localSearchParams) {
    defaultValue = JSON.parse(localSearchParams);
  }
  return defaultValue;
};

// 设置localStorage
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
