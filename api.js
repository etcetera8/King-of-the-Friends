export const apiCall = async (url, params) => {
  const response = await fetch(url+params);
  const parsedData = await response.json();
  console.log(parsedData);
  return parsedData[0];
}