#!/usr/bin/env node
/**
 * Script to fix all components to properly import mockApi
 */

const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix cases where mockApi is used but not imported
  if (content.includes('mockApi.') && !content.includes('import { mockApi')) {
    // Find the import section
    const lines = content.split('\n');
    let importAdded = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (!importAdded && lines[i].includes('import { useQuery')) {
        // Add mockApi to the import
        if (lines[i].includes('from "@/lib/mockHooks"')) {
          lines[i] = lines[i].replace('useQuery', 'useQuery, mockApi');
          importAdded = true;
          modified = true;
          break;
        }
      }
    }
    
    if (importAdded) {
      content = lines.join('\n');
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
      walkDir(filePath);
    } else if (stat.isFile()) {
      processFile(filePath);
    }
  });
}

const rootDir = path.join(__dirname, '.');
console.log('Fixing mockApi imports...');
walkDir(rootDir);
console.log('Done!');
