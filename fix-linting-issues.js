#!/usr/bin/env node

/**
 * Fix minor linting issues in diagnostic scripts
 * This script addresses Sourcery suggestions for better code quality
 */

const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'test-complete-sync.js',
  'test-comprehensive-timing.js',
  'test-realistic-structure.js',
  'test-start-playing-button.js'
];

console.log('🔧 Fixing linting issues in diagnostic scripts...');

filesToFix.forEach(filename => {
  const filepath = path.join(__dirname, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filepath, 'utf8');
    let changed = false;
    
    // Fix: Replace if-expression with `or` (line 46 in app-simple.py equivalent)
    content = content.replace(
      /(\w+)\s*\?\s*\w+\s*:\s*['"]?none['"]?/g,
      '$1 || "none"'
    );
    
    // Fix: Merge else clause's nested if statement into `else if`
    content = content.replace(
      /\s*else\s*{\s*if\s*\(/g,
      ' else if ('
    );
    
    // Fix: Use object destructuring when accessing properties
    content = content.replace(
      /const\s+(\w+)\s+=\s+(\w+)\.(\w+);/g,
      'const { $3: $1 } = $2;'
    );
    
    // Fix: Add block braces for if statements
    content = content.replace(
      /if\s*\([^)]+\)\s*([^{][^;\n]+;)/g,
      'if ($1) {\n    $2\n  }'
    );
    
    // Fix: Invert ternary operator to remove negation
    content = content.replace(
      /!\s*(\w+)\s*\?\s*([^:]+)\s*:\s*([^;]+)/g,
      '$1 ? $3 : $2'
    );
    
    if (changed) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`✅ Fixed linting issues in ${filename}`);
    } else {
      console.log(`ℹ️  No changes needed for ${filename}`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filename}:`, error.message);
  }
});

console.log('\n🎉 Linting fixes complete!');
console.log('\nNote: These are diagnostic/test scripts and minor linting issues');
console.log('don\'t affect the core application functionality.');
