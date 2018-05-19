const root = `https://www.strava.com/api/v3`;

export const apiCall = async (url, params) => {
  const response = await fetch(url+params);
  const parsedData = await response.json();
  return parsedData[0];
}

export const allApiCall = async (url) => {
  const response = await fetch(url);
  const parsedData = await response.json();
  return parsedData;
}

export const patchPostCall = async (url, email, option) => {
  const response = await fetch(url+email, option);
  return response
}

export const stravaLogin = async() => {
  let response = await fetch(`https://www.strava.com/oauth/authorize?client_id=25688&response_type=code&redirect_uri=http://localhost:8001/exchange_token&approval_prompt=force`)
  return response.url;
}

export const getUser = async (url) => {
  const token = url.substr(url.length - 40);
  console.log(token)
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json", "Content-Type": "application/json"
    },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(
      {
        token: token
      }
    )
  };
  const response = await fetch("http://localhost:8001/tokenexchange", options);
  const data = await response.json();
  const { access_token, athlete } = data;
  return data;
}