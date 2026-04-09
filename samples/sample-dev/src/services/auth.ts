import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomBytes } from "node:crypto";

const currentDir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(currentDir, "../../auth_data");
const usersFile = join(dataDir, "users.json");
const sessionsFile = join(dataDir, "sessions.json");

interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

interface Session {
  token: string;
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

function ensureDataDir() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
}

function loadUsers(): User[] {
  ensureDataDir();
  if (!existsSync(usersFile)) return [];
  try {
    return JSON.parse(readFileSync(usersFile, "utf-8"));
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  ensureDataDir();
  writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function loadSessions(): Session[] {
  ensureDataDir();
  if (!existsSync(sessionsFile)) return [];
  try {
    return JSON.parse(readFileSync(sessionsFile, "utf-8"));
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  ensureDataDir();
  writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function generateId(): string {
  return randomBytes(8).toString("hex");
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function registerUser(
  email: string,
  password: string
): { success: boolean; token?: string; error?: string } {
  if (!email || !password) {
    return { success: false, error: "Email and password required" };
  }

  const emailLower = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
    return { success: false, error: "Invalid email format" };
  }
  if (password.length < 4) {
    return { success: false, error: "Password must be at least 4 characters" };
  }

  const users = loadUsers();
  if (users.find((u) => u.email === emailLower)) {
    return { success: false, error: "Email already registered" };
  }

  const user: User = {
    id: generateId(),
    email: emailLower,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  };
  users.push(user);
  saveUsers(users);

  const token = createSession(user.id, user.email);
  return { success: true, token };
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; token?: string; error?: string } {
  if (!email || !password) {
    return { success: false, error: "Email and password required" };
  }

  const emailLower = email.toLowerCase().trim();
  const users = loadUsers();
  const user = users.find((u) => u.email === emailLower);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: "Invalid email or password" };
  }

  const token = createSession(user.id, user.email);
  return { success: true, token };
}

function createSession(userId: string, email: string): string {
  const sessions = loadSessions();
  const token = generateToken();
  sessions.push({
    token,
    userId,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  });
  saveSessions(sessions);
  return token;
}

export function validateSession(
  token: string | undefined
): { valid: boolean; userId?: string; email?: string } {
  if (!token) return { valid: false };
  const sessions = loadSessions();
  const session = sessions.find(
    (s) => s.token === token && s.expiresAt > Date.now()
  );
  if (!session) return { valid: false };
  return { valid: true, userId: session.userId, email: session.email };
}

export function logoutUser(token: string): void {
  const sessions = loadSessions().filter((s) => s.token !== token);
  saveSessions(sessions);
}
