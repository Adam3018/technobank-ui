const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = new URLSearchParams({
      page,
      perPage,
      sort: field,
      order,
    });

    const res = await fetch(`${BASE}/${resource}?${query}`);

    const data = await res.json();

    const contentRange = res.headers.get("Content-Range");
    const total = Number(contentRange.split("/")[1]);

    return {
      data,
      total,
    };
  },

  getOne: async (resource, params) => {
    const data = await request(`/${resource}/${params.id}`);

    return { data };
  },

  getMany: async (resource, params) => {
    const data = await Promise.all(
      params.ids.map((id) => request(`/${resource}/${id}`))
    );

    return { data };
  },

  getManyReference: async (resource) => {
    const data = await request(`/${resource}`);

    return {
      data,
      total: data.length,
    };
  },

  create: async (resource, params) => {
    const data = await request(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });

    return { data };
  },

  update: async (resource, params) => {
    const data = await request(`/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    return { data };
  },

  delete: async (resource, params) => {
    await request(`/${resource}/${params.id}`, {
      method: "DELETE",
    });

    return { data: { id: params.id } };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        request(`/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    );

    return { data: params.ids };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        request(`/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    );

    return { data: params.ids };
  },
};

export default dataProvider;