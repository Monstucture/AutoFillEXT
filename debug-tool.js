// AutoFillEXT Debug Tool
// Run this in the browser console to help find form elements

console.log('🔍 AutoFillEXT Debug Tool Loaded');

// Function to find form elements by various criteria
function findFormElements() {
    console.log('=== 🔍 SEARCHING FOR FORM ELEMENTS ===');
    
    const inputs = document.querySelectorAll('input, select, textarea');
    const results = {
        byId: {},
        byName: {},
        byPlaceholder: {},
        byType: {},
        allElements: []
    };
    
    inputs.forEach((input, index) => {
        const elementInfo = {
            index: index + 1,
            id: input.id || '',
            name: input.name || '',
            type: input.type || 'text',
            placeholder: input.placeholder || '',
            value: input.value || '',
            tagName: input.tagName,
            className: input.className || ''
        };
        
        results.allElements.push(elementInfo);
        
        // Group by ID
        if (input.id) {
            results.byId[input.id] = elementInfo;
        }
        
        // Group by name
        if (input.name) {
            results.byName[input.name] = elementInfo;
        }
        
        // Group by placeholder
        if (input.placeholder) {
            results.byPlaceholder[input.placeholder] = elementInfo;
        }
        
        // Group by type
        if (!results.byType[input.type]) {
            results.byType[input.type] = [];
        }
        results.byType[input.type].push(elementInfo);
    });
    
    console.log('📊 SUMMARY:');
    console.log(`Total form elements found: ${inputs.length}`);
    console.log(`Elements with ID: ${Object.keys(results.byId).length}`);
    console.log(`Elements with name: ${Object.keys(results.byName).length}`);
    console.log(`Elements with placeholder: ${Object.keys(results.byPlaceholder).length}`);
    
    console.log('\n📋 ALL ELEMENTS:');
    results.allElements.forEach(element => {
        console.log(`${element.index}. ID: "${element.id}" | Name: "${element.name}" | Type: "${element.type}" | Placeholder: "${element.placeholder}"`);
    });
    
    console.log('\n🆔 ELEMENTS BY ID:');
    Object.entries(results.byId).forEach(([id, element]) => {
        console.log(`ID: "${id}" -> Type: "${element.type}", Name: "${element.name}"`);
    });
    
    console.log('\n📝 ELEMENTS BY NAME:');
    Object.entries(results.byName).forEach(([name, element]) => {
        console.log(`Name: "${name}" -> Type: "${element.type}", ID: "${element.id}"`);
    });
    
    console.log('\n🔍 SEARCHING FOR COMMON FIELD NAMES:');
    const commonFields = [
        'first', 'last', 'name', 'firstName', 'lastName',
        'dob', 'birth', 'date', 'phone', 'email', 'address',
        'city', 'zip', 'state', 'coverage', 'dwelling', 'year',
        'built', 'sqft', 'square', 'roof', 'material', 'construction'
    ];
    
    commonFields.forEach(field => {
        const matches = results.allElements.filter(element => 
            element.id.toLowerCase().includes(field.toLowerCase()) ||
            element.name.toLowerCase().includes(field.toLowerCase()) ||
            element.placeholder.toLowerCase().includes(field.toLowerCase())
        );
        
        if (matches.length > 0) {
            console.log(`\n🔎 "${field}" matches:`);
            matches.forEach(match => {
                console.log(`  - ID: "${match.id}" | Name: "${match.name}" | Type: "${match.type}"`);
            });
        }
    });
    
    console.log('\n=== 🎯 DEBUG TOOL COMPLETE ===');
    return results;
}

// Function to test filling a specific element
function testFillElement(elementId, value = 'TEST_VALUE') {
    console.log(`🧪 Testing fill for element: ${elementId}`);
    
    const element = document.getElementById(elementId) || 
                   document.querySelector(`[name="${elementId}"]`) ||
                   document.querySelector(`#${elementId}`);
    
    if (element) {
        console.log(`✅ Found element: ${element.tagName} (${element.type})`);
        console.log(`📝 Current value: "${element.value}"`);
        
        // Try to fill
        try {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
            
            console.log(`✅ Successfully filled with: "${value}"`);
            console.log(`📝 New value: "${element.value}"`);
            return true;
        } catch (error) {
            console.error(`❌ Error filling element:`, error);
            return false;
        }
    } else {
        console.log(`❌ Element not found: ${elementId}`);
        return false;
    }
}

// Function to highlight form elements on the page
function highlightFormElements() {
    console.log('🎨 Highlighting form elements...');
    
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
        // Create highlight overlay
        const highlight = document.createElement('div');
        highlight.style.cssText = `
            position: absolute;
            border: 2px solid #ff0000;
            background: rgba(255, 0, 0, 0.1);
            pointer-events: none;
            z-index: 10000;
            font-size: 10px;
            color: #ff0000;
            padding: 2px;
            white-space: nowrap;
        `;
        
        const rect = input.getBoundingClientRect();
        highlight.style.left = rect.left + window.scrollX + 'px';
        highlight.style.top = rect.top + window.scrollY + 'px';
        highlight.style.width = rect.width + 'px';
        highlight.style.height = rect.height + 'px';
        
        highlight.textContent = `${index + 1}: ${input.id || input.name || input.type}`;
        
        document.body.appendChild(highlight);
        
        // Remove highlight after 5 seconds
        setTimeout(() => {
            if (highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
        }, 5000);
    });
    
    console.log(`🎨 Highlighted ${inputs.length} form elements (will disappear in 5 seconds)`);
}

// Make functions available globally
window.autoFillDebug = {
    findFormElements,
    testFillElement,
    highlightFormElements
};

console.log('💡 Available commands:');
console.log('  autoFillDebug.findFormElements() - Find all form elements');
console.log('  autoFillDebug.testFillElement("elementId", "value") - Test filling an element');
console.log('  autoFillDebug.highlightFormElements() - Highlight form elements on page');

// Auto-run the search
console.log('\n🚀 Auto-running form element search...');
autoFillDebug.findFormElements(); 