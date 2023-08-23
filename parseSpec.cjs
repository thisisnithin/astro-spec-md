const fs = require('fs');
const path = require('path');
const specMarkdown = require('spec-md');
const prettier = require('prettier');

const srcDir = './src/spec';
const targetDir = './src/pages/spec';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error(`Error reading source directory: ${err}`);
    return;
  }

  files.forEach(async (file) => {
    const filePath = path.join(srcDir, file);
    const extname = path.extname(filePath);
    const basename = path.basename(filePath, extname);

    if (extname === '.md') {
      const html = specMarkdown.html(filePath);

      const formatted = await prettier.format(html, {
        parser: 'html',
        printWidth: 120,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      });

      fs.writeFileSync(targetDir + '/' + basename + '.html', formatted);
    }
  });
});
