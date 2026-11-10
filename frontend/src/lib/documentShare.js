import axios from "axios";
import { BASE_URL } from "./config.js";

export function getInvitationDetails(invitationId, token) {
  return axios.get(`${BASE_URL}/document/invitations/${invitationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

export function createDocumentInvitation(documentId, data, token) {
  return axios.post(
    `${BASE_URL}/document/${documentId}/invitations`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    }
  )
}

export function acceptInvitation(invitationId, token) {
  return axios.post(`${BASE_URL}/document/invitations/${invitationId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
}


export function rejectInvitation(invitationId, token) {
    return axios.post(`${BASE_URL}/document/invitations/${invitationId}/reject`,
    {},
    {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        }
    }
  );
}
