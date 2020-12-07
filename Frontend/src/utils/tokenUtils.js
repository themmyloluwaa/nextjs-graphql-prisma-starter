import cookies from "next-cookies";

const getToken = (ctx = null) => {
  const isSSR = typeof window === "undefined";
  let token = "";
  if (isSSR) {
    token = cookies(ctx).token || "";
  } else {
    token = localStorage.getItem("token");
  }

  return token;
};

const setToken = (token = "") => {
  if (token.length === 0) {
    return;
  }
  document.cookie = `token=${token}; path=/`;
  localStorage.setItem("token", token);
};

export { setToken, getToken };
