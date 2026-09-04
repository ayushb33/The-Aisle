import fs from 'fs';
import path from 'path';

const searchRegexes = [
  { search: /bg-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'bg-$1' },
  { search: /text-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'text-$1' },
  { search: /border-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'border-$1' },
  { search: /from-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'from-$1' },
  { search: /to-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'to-$1' },
  { search: /ring-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'ring-$1' },
  { search: /fill-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'fill-$1' },
  { search: /stroke-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'stroke-$1' },
  { search: /accent-\[--color-([a-zA-Z0-9_-]+)\]/g, replace: 'accent-$1' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { search, replace } of searchRegexes) {
        content = content.replace(search, replace);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), 'src'));
