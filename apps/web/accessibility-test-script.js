// Accessibility Test Script for Place Cards
// Run this in the browser console on the places page

console.log('🔍 Starting Place Cards Accessibility Test...\n');

// Test 1: Check for proper heading structure
function testHeadingStructure() {
  console.log('1. Testing Heading Structure...');
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    console.log(`   ${heading.tagName}: "${heading.textContent.trim()}"`);
  });
  console.log(`   ✅ Found ${headings.length} headings\n`);
}

// Test 2: Check for alt text on images
function testImageAltText() {
  console.log('2. Testing Image Alt Text...');
  const images = document.querySelectorAll('img');
  let missingAlt = 0;
  
  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === '') {
      console.log(`   ❌ Image ${index + 1} missing alt text:`, img.src);
      missingAlt++;
    } else {
      console.log(`   ✅ Image ${index + 1}: "${img.alt}"`);
    }
  });
  
  if (missingAlt === 0) {
    console.log(`   ✅ All ${images.length} images have alt text\n`);
  } else {
    console.log(`   ❌ ${missingAlt}/${images.length} images missing alt text\n`);
  }
}

// Test 3: Check for proper link context
function testLinkContext() {
  console.log('3. Testing Link Context...');
  const links = document.querySelectorAll('a');
  let vagueLinkCount = 0;
  
  links.forEach((link, index) => {
    const linkText = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    const contextualText = ariaLabel || title || linkText;
    
    if (!contextualText || contextualText.length < 4) {
      console.log(`   ❌ Link ${index + 1} lacks context: "${linkText}"`);
      vagueLinkCount++;
    } else if (['click here', 'read more', 'more'].includes(linkText.toLowerCase())) {
      console.log(`   ⚠️  Link ${index + 1} has vague text: "${linkText}"`);
      vagueLinkCount++;
    } else {
      console.log(`   ✅ Link ${index + 1}: "${contextualText}"`);
    }
  });
  
  console.log(`   ${vagueLinkCount === 0 ? '✅' : '❌'} ${vagueLinkCount}/${links.length} links need better context\n`);
}

// Test 4: Check for keyboard navigation
function testKeyboardNavigation() {
  console.log('4. Testing Keyboard Navigation...');
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  
  console.log(`   Found ${focusableElements.length} focusable elements:`);
  
  focusableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const id = element.id;
    const classes = element.className;
    
    console.log(`   ${index + 1}. ${tagName}${role ? `[role="${role}"]` : ''}${id ? `#${id}` : ''}`);
    
    // Check if element has visible focus indicator
    const computedStyle = window.getComputedStyle(element, ':focus');
    const hasFocusOutline = computedStyle.outline !== 'none' || 
                           computedStyle.boxShadow !== 'none' ||
                           classes.includes('focus:');
    
    if (!hasFocusOutline) {
      console.log(`      ⚠️  May lack visible focus indicator`);
    }
  });
  console.log(`   ✅ All elements should be keyboard accessible\n`);
}

// Test 5: Check for ARIA attributes
function testARIAAttributes() {
  console.log('5. Testing ARIA Attributes...');
  
  // Check for buttons with proper labels
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const ariaLabel = button.getAttribute('aria-label');
    const textContent = button.textContent.trim();
    const ariaPressed = button.getAttribute('aria-pressed');
    
    console.log(`   Button ${index + 1}:`);
    console.log(`     Text: "${textContent}"`);
    if (ariaLabel) console.log(`     ARIA Label: "${ariaLabel}"`);
    if (ariaPressed !== null) console.log(`     ARIA Pressed: "${ariaPressed}"`);
    
    if (!ariaLabel && !textContent) {
      console.log(`     ❌ Button lacks accessible name`);
    } else {
      console.log(`     ✅ Has accessible name`);
    }
  });
  
  // Check for proper roles
  const elementsWithRoles = document.querySelectorAll('[role]');
  console.log(`   Found ${elementsWithRoles.length} elements with explicit roles`);
  
  elementsWithRoles.forEach((element, index) => {
    const role = element.getAttribute('role');
    console.log(`     ${index + 1}. ${element.tagName.toLowerCase()}[role="${role}"]`);
  });
  
  console.log('   ✅ ARIA attributes check complete\n');
}

// Test 6: Check color contrast (basic)
function testColorContrast() {
  console.log('6. Testing Color Contrast (Basic Check)...');
  
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button');
  let lowContrastCount = 0;
  
  textElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Simple check for very light gray text that might be problematic
    if (color.includes('rgb(156') || color.includes('rgb(107') || color.includes('rgb(75')) {
      console.log(`   ⚠️  Element ${index + 1} may have low contrast: ${color} on ${backgroundColor}`);
      lowContrastCount++;
    }
  });
  
  if (lowContrastCount === 0) {
    console.log('   ✅ No obvious contrast issues detected');
  } else {
    console.log(`   ⚠️  ${lowContrastCount} elements may have contrast issues`);
  }
  console.log('   💡 Use browser DevTools Lighthouse for detailed contrast analysis\n');
}

// Test 7: Check for loading states accessibility
function testLoadingStates() {
  console.log('7. Testing Loading States Accessibility...');
  
  const skeletonElements = document.querySelectorAll('.animate-pulse');
  const loadingButtons = document.querySelectorAll('button[disabled]');
  
  console.log(`   Found ${skeletonElements.length} skeleton loading elements`);
  console.log(`   Found ${loadingButtons.length} disabled/loading buttons`);
  
  // Check if loading elements have proper ARIA attributes
  skeletonElements.forEach((element, index) => {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLive = element.getAttribute('aria-live');
    
    if (!ariaLabel && !ariaLive) {
      console.log(`   ⚠️  Skeleton ${index + 1} may need aria-label="Loading..."`);
    }
  });
  
  console.log('   ✅ Loading states check complete\n');
}

// Test 8: Mobile accessibility features
function testMobileAccessibility() {
  console.log('8. Testing Mobile Accessibility...');
  
  // Check touch target sizes
  const touchTargets = document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]');
  let smallTargets = 0;
  
  touchTargets.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // WCAG recommendation
    
    if (rect.width < minSize || rect.height < minSize) {
      console.log(`   ⚠️  Touch target ${index + 1} is ${Math.round(rect.width)}x${Math.round(rect.height)}px (recommended: 44x44px)`);
      smallTargets++;
    }
  });
  
  if (smallTargets === 0) {
    console.log(`   ✅ All ${touchTargets.length} touch targets meet size requirements`);
  } else {
    console.log(`   ⚠️  ${smallTargets}/${touchTargets.length} touch targets may be too small`);
  }
  
  // Check viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    console.log(`   ✅ Viewport meta tag found: ${viewportMeta.content}`);
  } else {
    console.log(`   ❌ Viewport meta tag missing`);
  }
  
  console.log('   ✅ Mobile accessibility check complete\n');
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running comprehensive accessibility tests for Place Cards\n');
  console.log('=' .repeat(60));
  
  testHeadingStructure();
  testImageAltText();
  testLinkContext();
  testKeyboardNavigation();
  testARIAAttributes();
  testColorContrast();
  testLoadingStates();
  testMobileAccessibility();
  
  console.log('=' .repeat(60));
  console.log('✅ Accessibility testing complete!');
  console.log('\n💡 Additional recommendations:');
  console.log('   1. Run Lighthouse accessibility audit');
  console.log('   2. Test with screen reader (VoiceOver/NVDA)');
  console.log('   3. Test keyboard-only navigation');
  console.log('   4. Test with high contrast mode');
  console.log('   5. Test with reduced motion preferences');
}

// Auto-run when script is loaded
runAllTests();