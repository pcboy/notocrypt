export const ToBase64 = function(u8) {
  return btoa(String.fromCharCode.apply(null, u8));
};

export const FromBase64 = function(str) {
  return new Uint8Array(
    atob(str)
      .split("")
      .map(function(c) {
        return c.charCodeAt(0);
      })
  );
};
