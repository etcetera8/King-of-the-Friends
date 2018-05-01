export const apiCall = async (url, params) => {
  const response = await fetch(url+params);
  const parsedData = await response.json();
  return parsedData[0];
}

export const apiLoginUser = async () => {
  global.location = `https://www.strava.com/oauth/authorize?client_id=22618&response_type=code&redirect_uri=http://localhost:8081/exchange_token&approval_prompt=force`;
}

export const getUser = async () => {
  const url = window.location.href;
  const token = url.substr(url.length - 40);
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

  const response = await fetch("https://kog-lock-backend.herokuapp.com/tokenexchange", options);
  const data = await response.json();
  const { access_token, athlete } = data;
  console.log(data);
  return data;
};

export const initialCall = async (token) => {
  try {
    const response = await fetch(`${root}/athlete?access_token=${token}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    return error;
  }
};