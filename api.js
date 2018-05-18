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

export const stravaLogin = async() => {
  let response = await fetch(`https://www.strava.com/oauth/authorize?client_id=25688&response_type=code&redirect_uri=http://localhost:8001/exchange_token&approval_prompt=force`)
  return response.url;
}