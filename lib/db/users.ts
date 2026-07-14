import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeUser } from "@/lib/users/normalize";
import type { User, UserInput } from "@/types/user";

const DATA_PATH = path.join(process.cwd(), "data/users.json");

async function readUsers(): Promise<User[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const users = JSON.parse(raw) as User[];
    return users.map(normalizeUser);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(users, null, 2)}\n`, "utf-8");
}

function normalizeInput(input: UserInput): UserInput {
  return normalizeUser({
    id: "",
    createdAt: "",
    updatedAt: "",
    ...input,
  });
}

export async function getUsers(): Promise<User[]> {
  const users = await readUsers();
  return users.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function createUser(input: UserInput): Promise<User> {
  const users = await readUsers();
  const normalized = normalizeInput(input);
  const email = normalized.email.toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error("A user with this email already exists");
  }

  const now = new Date().toISOString();
  const user: User = {
    id: crypto.randomUUID(),
    ...normalized,
    email,
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new Error("User not found");
  }

  const normalized = normalizeInput(input);
  const email = normalized.email.toLowerCase();

  if (
    users.some(
      (user, userIndex) =>
        userIndex !== index && user.email.toLowerCase() === email,
    )
  ) {
    throw new Error("A user with this email already exists");
  }

  const updated: User = {
    ...users[index],
    ...normalized,
    email,
    id: users[index].id,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updated;
  await writeUsers(users);
  return updated;
}

export async function deleteUser(id: string): Promise<void> {
  const users = await readUsers();
  const next = users.filter((user) => user.id !== id);

  if (next.length === users.length) {
    throw new Error("User not found");
  }

  await writeUsers(next);
}
