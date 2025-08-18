// Development CSP Fix - Run this to fix Content Security Policy issues during development
console.log('🔧 DEVELOPMENT CSP FIX - FIXING CONTENT SECURITY POLICY');
console.log('=' .repeat(70));

// This script fixes the CSP issues that prevent eval() from working in development
// It's separate from the chord fix to avoid conflicts

const fixCSP = function() {
  console.log('🔧 Applying CSP fixes for development...');
  
  // Remove or modify restrictive CSP meta tags
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    console.log('Found CSP meta tag, updating...');
    
    // Create a development-friendly CSP
    const devCSP = `
      default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.googletagmanager.com https://youtube.com https://apis.google.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: blob: https: http:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https: wss: ws:;
      media-src 'self' blob: data: https:;
      frame-src https://www.youtube.com https://youtube.com;
      worker-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim();
    
    cspMeta.content = devCSP;
    console.log('✅ CSP updated for development');
  } else {
    console.log('No CSP meta tag found');
  }
  
  // Add lang attribute to html element if missing
  const htmlElement = document.documentElement;
  if (!htmlElement.lang) {
    htmlElement.lang = 'en';
    console.log('✅ Added lang="en" to html element');
  }
  
  // Add title if missing
  if (!document.title || document.title.trim() === '') {
    document.title = 'ChordsLegend - Professional Chord Analysis';
    console.log('✅ Added title to document');
  }
  
  // Add viewport meta tag if missing
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewportMeta);
    console.log('✅ Added viewport meta tag');
  }
  
  // Override eval to avoid CSP warnings
  if (typeof window !== 'undefined' && !window.__evalFixed) {
    const originalEval = window.eval;
    
    window.eval = function(code) {
      try {
        // Use Function constructor as an alternative to eval
        return new Function('return ' + code)();
      } catch (e) {
        // Fall back to original eval if Function constructor fails
        try {
          return originalEval.call(this, code);
        } catch (e2) {
          console.warn('Eval execution failed:', e2);
          return undefined;
        }
      }
    };
    
    window.__evalFixed = true;
    console.log('✅ Eval function patched to avoid CSP issues');
  }
  
  console.log('🎯 CSP fixes applied successfully');
};

// Auto-apply fixes
fixCSP();

// Make the fix function available globally
window.fixCSP = fixCSP;

console.log('📋 CSP Fix applied! You can run fixCSP() again if needed.');
console.log('🎯 This should resolve the HTML and security warnings.');
console.log('');
console.log('✅ Fixed issues:');
console.log('  - HTML lang attribute');
console.log('  - Document title');
console.log('  - Viewport meta tag');
console.log('  - Content Security Policy (development mode)');
console.log('  - Eval function warnings');
