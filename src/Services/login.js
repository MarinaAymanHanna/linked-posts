import { signin } from "./authService";

export async function sendLoginData(values) {
  try {
    const data = await signin(values);
    return data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}