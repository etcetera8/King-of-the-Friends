export const apiCall = async (url, params) => {
  const response = await fetch(url+params);
  const parsedData = await response.json();
  return parsedData[0];
}