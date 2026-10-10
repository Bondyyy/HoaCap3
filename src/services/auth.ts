import { users, write } from "./storage";
const hex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
async function verifier(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(salt.match(/../g)!, (h) => parseInt(h, 16)),
      iterations: 210000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return hex(new Uint8Array(bits));
}
export async function register(
  fullName: string,
  username: string,
  password: string,
  confirm: string,
) {
  username = username.trim().toLowerCase();
  if (fullName.trim().length < 2 || fullName.trim().length > 80)
    throw Error("Họ tên cần từ 2 đến 80 ký tự.");
  if (!/^[a-z0-9_]{3,24}$/.test(username))
    throw Error("Tên đăng nhập: 3–24 ký tự a–z, 0–9 hoặc _.");
  if (password.length < 8 || password.length > 128)
    throw Error("Mật khẩu cần từ 8 đến 128 ký tự.");
  if (password !== confirm) throw Error("Mật khẩu xác nhận chưa khớp.");
  if (users().some((u) => u.username === username))
    throw Error("Tên đăng nhập đã tồn tại trên trình duyệt này.");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const passwordVerifier = await verifier(password, salt);
  const all = users();
  if (all.some((u) => u.username === username))
    throw Error("Tên đăng nhập đã tồn tại.");
  write("users", [
    ...all,
    {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      username,
      passwordSalt: salt,
      passwordVerifier,
      createdAt: new Date().toISOString(),
    },
  ]);
}
export async function login(username: string, password: string) {
  const user = users().find(
    (u) => u.username === username.trim().toLowerCase(),
  );
  if (
    !user ||
    (await verifier(password, user.passwordSalt)) !== user.passwordVerifier
  )
    throw Error("Tên đăng nhập hoặc mật khẩu không đúng.");
  write("session", {
    currentUserId: user.id,
    loginTimestamp: new Date().toISOString(),
  });
  return user;
}
export const logout = () => write("session", { currentUserId: "" });
