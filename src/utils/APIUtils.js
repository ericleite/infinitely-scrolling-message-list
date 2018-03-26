export const apiEndpoint = 'http://message-list.appspot.com';

export const messagesApiEndpoint = `${apiEndpoint}/messages`;

export const messagesApiEndpointTemplate = (token) => {
  if (token) {
    return `${messagesApiEndpoint}?pageToken=${token}`
  }
  return messagesApiEndpoint;
};
