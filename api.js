const root = `https://www.strava.com/api/v3`;
export const serverRoot = `http://localhost:8001/api/v1/`;
//Server calls
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
  const fullResponse = await response.json();
  return fullResponse;
}

export const getUser = async (url) => {
  if (url === undefined) {
    return {errors: "no url to parse for tokens"}
  }
  const tokens = url.substr(url.length - 47).substr(0, 40);
  //let token = "ea8b78d5c2a34a991aab221bac024d3cdf36e184"
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json", "Content-Type": "application/json"
    },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(
      {
        token: tokens
      }
    )
  };
  const response = await fetch("http://localhost:8001/tokenexchange", options);
  const data = await response.json();
  const { access_token, athlete } = data;
  return data;
}

export const editTeamCall = async (method, teamId, editSegmentId, segment_id, editDate, finish_date) => {
  if (!editDate & !editSegmentId) {
    //Display handle error here
    console.log('You must enter info to update it');
  } else {
    const tempId = !editSegmentId ? segment_id : editSegmentId;
    const tempDate = !editDate ? finish_date : editDate;
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        segment_id: tempId,
        finish_date: tempDate
      })
    }
    const validate = await patchPostCall('http://localhost:8001/api/v1/team/', teamId, options)
    return validate
  }
}
// STRAVA CALLS

export const stravaLogin = async() => {
  let response = await fetch(`https://www.strava.com/oauth/authorize?client_id=25688&response_type=code&redirect_uri=http://localhost:8001/exchange_token&approval_prompt=force`)
  return response.url;
}

export const segmentCall = async (segmentId, token) => {
  try {
    const response = await fetch(`${root}/segments/${segmentId}?access_token=${token}`);
    const segmentData = await response.json();
    return segmentData
  } catch (error) {
    return { error, message: "failed to fetch" };
  }
};

export const getUserAttempts = async (segmentId, token) => {
  try {
    const response = await fetch(`${root}/segments/${segmentId}/all_efforts?access_token=${token}`);
    const segmentData = await response.json();
    return segmentData;
  } catch(error) {  
    return {error, message: "failed to fetch"}
  }
}
