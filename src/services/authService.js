import { request } from "./api.js";
export const requestOtp = (phone, dial_code) =>
  request("/v1/pwa/user/register", {
    method: "POST",
    form: { phone, dial_code },
  });
export const loginWithOtp = async (phone, otp, dial_code) => {
  const res = await request("/v1/pwa/user/login", {
    method: "POST",
    form: { phone, otp, dial_code },
  });
  if (!res.data || !res.data.token)
    throw new Error("Login failed. Please try again.");
  return res.data;
};
