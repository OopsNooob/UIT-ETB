#!/usr/bin/env node
/**
 * Script to replace Convex and Clerk imports with mock hooks
 * Run: node replace-imports.js
 */

const fs = require('fs');
const path = require('path');

const replacements = [
  // Clerk imports
  {
    pattern: /import\s*{\s*SignInButton,\s*SignedIn,\s*SignedOut,\s*UserButton,\s*useUser\s*}\s*from\s*["']@clerk\/nextjs["'];?/g,
    replacement: `import { SignInButton, SignedIn, SignedOut, UserButton } from "@/lib/mockComponents";
import { useUser } from "@/lib/mockHooks";`
  },
  {
    pattern: /import\s*{\s*useUser\s*}\s*from\s*["']@clerk\/nextjs["'];?/g,
    replacement: `import { useUser } from "@/lib/mockHooks";`
  },
  {
    pattern: /import\s*{\s*SignInButton\s*}\s*from\s*["']@clerk\/nextjs["'];?/g,
    replacement: `import { SignInButton } from "@/lib/mockComponents";`
  },
  {
    pattern: /import\s*{\s*SignUp\s*}\s*from\s*["']@clerk\/nextjs["'];?/g,
    replacement: `// Mock SignUp - using login instead\n// import { SignUp } from "@clerk/nextjs";`
  },
  {
    pattern: /import\s*{\s*SignIn\s*}\s*from\s*["']@clerk\/nextjs["'];?/g,
    replacement: `// Mock SignIn - using login instead\n// import { SignIn } from "@clerk/nextjs";`
  },
  
  // Convex imports
  {
    pattern: /import\s*{\s*useQuery,\s*useMutation\s*}\s*from\s*["']convex\/react["'];?/g,
    replacement: `import { useQuery, useMutation } from "@/lib/mockHooks";`
  },
  {
    pattern: /import\s*{\s*useQuery\s*}\s*from\s*["']convex\/react["'];?/g,
    replacement: `import { useQuery } from "@/lib/mockHooks";`
  },
  {
    pattern: /import\s*{\s*useMutation\s*}\s*from\s*["']convex\/react["'];?/g,
    replacement: `import { useMutation } from "@/lib/mockHooks";`
  },
  {
    pattern: /import\s*{\s*ConvexProvider,\s*ConvexReactClient\s*}\s*from\s*["']convex\/react["'];?/g,
    replacement: `import { ConvexProvider, ConvexReactClient } from "@/lib/mockComponents";`
  },
  {
    pattern: /import\s*{\s*api\s*}\s*from\s*["']@\/convex\/_generated\/api["'];?/g,
    replacement: `import { mockApi as api } from "@/lib/mockHooks";`
  },
  {
    pattern: /import\s*{\s*Id\s*}\s*from\s*["']@\/convex\/_generated\/dataModel["'];?/g,
    replacement: `// Mock Id - no longer needed\n// import { Id } from "@/convex/_generated/dataModel";`
  },
  {
    pattern: /import\s*{\s*Doc\s*}\s*from\s*["']@\/convex\/_generated\/dataModel["'];?/g,
    replacement: `// Mock Doc - no longer needed\n// import { Doc } from "@/convex/_generated/dataModel";`
  },
  {
    pattern: /import\s*{\s*ConvexError\s*}\s*from\s*["']convex\/values["'];?/g,
    replacement: `// Mock ConvexError - no longer needed\n// import { ConvexError } from "convex/values";`
  },
  {
    pattern: /import\s*{\s*WAITING_LIST_STATUS\s*}\s*from\s*["']@\/convex\/constants["'];?/g,
    replacement: `const WAITING_LIST_STATUS = { WAITING: 'waiting', ACCEPTED: 'accepted', REJECTED: 'rejected' };`
  },
  {
    pattern: /import\s*{\s*Metrics\s*}\s*from\s*["']@\/convex\/events["'];?/g,
    replacement: `// Mock Metrics - no longer needed\n// import { Metrics } from "@/convex/events";`
  },
  {
    pattern: /import\s*{\s*ClerkProvider\s*}\s*from\s*["']@clerk\/nextjs["'];?/g,
    replacement: `import { ClerkProvider } from "@/lib/mockComponents";`
  }
];

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  // Also replace api. references with mockApi
  if (content.includes('api.')) {
    content = content.replace(/([^\w])api\./g, '$1mockApi.');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
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
console.log('Starting import replacement...');
walkDir(rootDir);
console.log('Done!');
