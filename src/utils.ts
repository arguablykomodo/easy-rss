const getDomain = (url: string) =>
  url
    .replace("http://", "")
    .replace("https://", "")
    .split(/[/?#]/)[0];

export { getDomain };
