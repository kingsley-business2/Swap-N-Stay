import fs from 'fs';
import path from 'path';

const filePath = path.resolve(
  'node_modules/@antfu/utils/dist/index.d.mts'
);

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;

  const patched = data.replace(
    /then`\(fn\?: \(\)` => PromiseLike<any>\): Promise<any>/,
    `then<TResult1 = Awaited<T>[], TResult2 = never>(
      onfulfilled?: (value: Awaited<T>[]) => TResult1 | PromiseLike<TResult1>,
      onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
    ): Promise<TResult1 | TResult2>`
  );

  fs.writeFile(filePath, patched, 'utf8', (err) => {
    if (err) throw err;
    console.log('✅ Patched @antfu/utils for Netlify build');
  });
});
