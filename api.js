export const apiCall = async (url, params) => {
  const response = await fetch(url+params);
  console.log(response)
  const parsedData = await response.json();
  return parsedData[0];
}

export const allApiCall = async (url) => {
  const response = await fetch(url);
  const parsedData = await response.json();
  return parsedData;
}