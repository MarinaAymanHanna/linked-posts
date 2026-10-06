import apiClient from "./apiClient";

export async function signup(userData) {
  const { data } = await apiClient.post("/users/signup", userData);
  return data;
}

export async function signin(credentials) {
  const { data } = await apiClient.post("/users/signin", credentials);
  return data;
}

export async function getMyProfile() {
  const { data } = await apiClient.get("/users/profile-data");
  return data;
}

export async function changePassword({ password, newPassword }) {
  const { data } = await apiClient.patch("/users/change-password", {
    password,
    newPassword,
  });
  return data;
}

export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await apiClient.put("/users/upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
