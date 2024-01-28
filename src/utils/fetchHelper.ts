export const postFetchWithToken = async (
  url: string,
  data: object,
  token: string,
) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message);
    }
    return resData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const postFetch = async (url: string, data: object) => {
  const resData = await fetchRequest(url, data, 'POST');

  return resData;
};

export const patchFetch = async (url: string, data: object, token: string) => {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await response.json();

  return resData;
};

export const deleteFetch = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();

  return resData;
};

export const getFetch = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();
  if (resData.message === 'Unauthorized') {
    throw new Error('Unauthorized');
  }

  return resData;
};

const fetchRequest = async (url: string, data?: object, method?: string) => {
  let resData;
  let body: RequestInit | null = null;

  if (data || method) {
    body = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      body.body = JSON.stringify(data);
    }
  }

  try {
    const response: Response = body ? await fetch(url, body) : await fetch(url);
    if (!response.ok || response.statusText !== 'Created') {
      throw new Error(response.statusText);
    }

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    resData = await response.json();
  } catch (error: any) {
    throw error;
  }

  return resData;
};
