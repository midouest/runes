import { session } from "electron";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

const EXTENSIONS = {
  "React Dev Tools": "fmkadmapgofadopljbjfkapdkoienihi",
  "C/C++ Dev Tools": "pdcpmagijalfljmkmjngeonclgbbannb",
} as const;

const BASE_EXTENSION_PATH = path.join(
  os.homedir(),
  "/Library/Application Support/Google/Chrome/Default/Extensions"
);

async function getExtensionPath(extensionId: string): Promise<string> {
  const extDir = path.join(BASE_EXTENSION_PATH, extensionId);
  const files = await fs.readdir(extDir);
  return path.join(extDir, files[0]);
}

async function loadExtension(extensionId: string): Promise<void> {
  const extensionPath = await getExtensionPath(extensionId);
  await session.defaultSession.loadExtension(extensionPath);
}

export async function loadExtensions(): Promise<void> {
  for (const [name, id] of Object.entries(EXTENSIONS)) {
    try {
      await loadExtension(id);
    } catch (err) {
      console.log(`Failed to load ${name} extension`);
      console.log(err);
    }
  }
}
