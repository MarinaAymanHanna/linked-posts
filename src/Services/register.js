import { signup } from "./authService";

export async function sendRegisterData(values) {
  try {
    const data = await signup(values);
    return data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}