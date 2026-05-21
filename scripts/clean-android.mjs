/**
 * Safe Android clean for RN New Architecture.
 * Avoid `./gradlew clean` — it often breaks CMake/codegen on Windows.
 */
import fs from 'fs';
import path from 'path';

const androidDir = path.join(process.cwd(), 'android');

const removePaths = [
  path.join(androidDir, 'app', '.cxx'),
  path.join(androidDir, 'app', 'build'),
  path.join(androidDir, 'build'),
];

for (const target of removePaths) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log('Removed:', target);
  }
}

console.log('Done. Run: npm run android');
