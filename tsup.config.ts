import { Options, defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

const common: Options = {
  treeshake: false,
  sourcemap: 'inline',
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ['cjs', 'esm'],
  external: ['react'],
  injectStyle: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addUseStatement = (basePath: string, type: 'server' | 'client') => {
  const fullPath = path.join(__dirname, basePath);
  const files = fs.readdirSync(fullPath);

  files.forEach((file) => {
    if (file.endsWith('.js') || file.endsWith('.mjs')) {
      const filePath = path.join(fullPath, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      content = `"use ${type}";\n${content}`;
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  });
};

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/server/index.ts',
    'src/react/index.ts',
    'src/styles.css',
  ],
  async onSuccess() {
    addUseStatement('dist/react', 'client');
    childProcess.execSync('pnpm link:self');
    console.log('🖇️  Linked package');
  },
  ...common,
});
