const BASE_URL = "http://localhost:3001/requests";

function handleJson(res) {
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchRequests() {
  const res = await fetch(BASE_URL);
  return handleJson(res);
}

export async function fetchRequestById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleJson(res);
}


export async function createRequest(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function updateRequest(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleJson(res);
}


export async function deleteRequest(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
}

