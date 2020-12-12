import cookies from "next-cookies";

const getToken = (ctx = {}) => {
  const isSSR = typeof window === "undefined";
  let token = "";
  if (isSSR) {
    token = cookies(ctx)?.token ?? "";
  } else {
    token = localStorage.getItem("token") ?? "";
  }

  return token;
};

const setToken = (data = {}) => {
  if (!data) {
    return;
  }

  document.cookie = `token=${data.token}; path=/`;
  document.cookie = `user=${JSON.stringify(data.user)}; path=/`;
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export { setToken, getToken };
