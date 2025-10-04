export const listUsers = async () => {
  const res = await fetch(`${process.env.API_URL}/admin/users`);
  return res.json();
};

export const createUser = async (user: any) => {
  const res = await fetch(`${process.env.API_URL}/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const editUser = async (id: string, user: any) => {
  const res = await fetch(`${process.env.API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/admin/users/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const blockUser = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/admin/users/${id}/block`, {
    method: 'POST',
  });
  return res.json();
};
