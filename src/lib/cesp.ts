import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';

export interface CespManifest {
  cesp_version: string;
  name: string;
  display_name: string;
  version: string;
  categories: Record<string, {
    sounds: Array<{ file: string; label: string; sha256?: string }>;
  }>;
  category_aliases?: Record<string, string>;
}

// Global state for debounce and no-repeat logic
const lastPlayedTime: Record<string, number> = {};
const lastPlayedSound: Record<string, string> = {};

let manifestCache: CespManifest | null = null;
let packDirCache: string | null = null;

function getPackDir() {
  if (packDirCache) return packDirCache;
  const projectRoot = process.cwd();
  packDirCache = path.join(projectRoot, 'sounds', 'sc_scv');
  return packDirCache;
}

function getManifest(): CespManifest | null {
  if (manifestCache) return manifestCache;
  
  try {
    const packDir = getPackDir();
    const manifestPath = path.join(packDir, 'openpeon.json');
    if (!fs.existsSync(manifestPath)) {
      console.warn(`[CESP] Manifest not found at ${manifestPath}`);
      return null;
    }
    const data = fs.readFileSync(manifestPath, 'utf8');
    manifestCache = JSON.parse(data) as CespManifest;
    return manifestCache;
  } catch (err) {
    console.error('[CESP] Failed to parse manifest:', err);
    return null;
  }
}

function resolveCategory(manifest: CespManifest, category: string): string | null {
  if (manifest.categories[category]) {
    return category;
  }
  if (manifest.category_aliases && manifest.category_aliases[category]) {
    const alias = manifest.category_aliases[category];
    if (manifest.categories[alias]) {
      return alias;
    }
  }
  return null;
}

function pickRandomSound(category: string, sounds: Array<{ file: string; label: string }>): string | null {
  if (!sounds || sounds.length === 0) return null;
  if (sounds.length === 1) return sounds[0].file;

  const candidates = sounds.filter(s => s.file !== lastPlayedSound[category]);
  // If all were excluded (shouldn't happen with >1 sounds), fallback to original array
  const selectionPool = candidates.length > 0 ? candidates : sounds;
  
  const selected = selectionPool[Math.floor(Math.random() * selectionPool.length)];
  lastPlayedSound[category] = selected.file;
  return selected.file;
}

function getPlayCommand(filePath: string, volume: number): string {
  const platform = os.platform();
  
  // Volume scaling depending on backend (0.0 to 1.0)
  if (platform === 'darwin') {
    return `nohup afplay -v ${volume} "${filePath}" >/dev/null 2>&1 &`;
  } else if (platform === 'linux') {
    // Attempt multiple linux backends. pw-play uses raw float, paplay uses 0-65536
    const paVolume = Math.floor(volume * 65536);
    const ffVolume = Math.floor(volume * 100);
    return `(pw-play --volume=${volume} "${filePath}" || paplay --volume=${paVolume} "${filePath}" || ffplay -nodisp -autoexit -volume ${ffVolume} "${filePath}" || play -v ${volume} "${filePath}" || aplay "${filePath}") >/dev/null 2>&1 &`;
  } else if (platform === 'win32') {
    // Windows PowerShell fallback
    const psScript = `
      $player = New-Object System.Windows.Media.MediaPlayer
      $player.Open([Uri]::new('${filePath}'))
      $player.Volume = ${volume}
      $player.Play()
      Start-Sleep -Seconds 5
    `;
    return `powershell -Command "${psScript.replace(/\n/g, ';')}" >NUL 2>&1 &`;
  }
  
  return `nohup afplay -v ${volume} "${filePath}" >/dev/null 2>&1 &`;
}

export async function playCespEvent(category: string, volume: number = 1.0): Promise<void> {
  const manifest = getManifest();
  if (!manifest) return;

  // 6. Debounce rapid events
  const now = Date.now();
  if (lastPlayedTime[category] && now - lastPlayedTime[category] < 500) {
    console.log(`[CESP] Debounced rapid event for category: ${category}`);
    return; // Debounce
  }
  lastPlayedTime[category] = now;

  const resolvedCategory = resolveCategory(manifest, category);
  if (!resolvedCategory) {
    // Silently skip if the active pack doesn't have the category
    return;
  }

  const categoryData = manifest.categories[resolvedCategory];
  const relativeFilePath = pickRandomSound(resolvedCategory, categoryData.sounds);
  if (!relativeFilePath) return;

  const packDir = getPackDir();
  // Ensure path is absolute and handles missing 'sounds/' prefix if necessary
  const normalizedRelativePath = relativeFilePath.includes('/') ? relativeFilePath : `sounds/${relativeFilePath}`;
  const absolutePath = path.join(packDir, normalizedRelativePath);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`[CESP] Sound file not found: ${absolutePath}`);
    return;
  }

  const command = getPlayCommand(absolutePath, volume);
  
  // Async playback, don't wait for completion
  exec(command, (error) => {
    if (error) {
      console.error(`[CESP] Error playing sound:`, error);
    }
  });
}
