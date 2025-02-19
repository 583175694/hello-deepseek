import { nanoid } from "nanoid";

const CLIENT_ID_KEY = "x-client-id";

export function getClientId(): string {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);

  if (!clientId) {
    clientId = nanoid();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }

  return clientId;
}

export function getClientIdHeader(): { [key: string]: string } {
  return {
    [CLIENT_ID_KEY]: getClientId(),
  };
}
