// Initialize the content script
console.log('AutoFillEXT content script initialized');

// Set up a MutationObserver to watch for dynamically added elements
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Check for form elements that might be missing accessibility attributes
                const formElements = node.querySelectorAll ? node.querySelectorAll('input, select, textarea') : [];
                if (node.matches && node.matches('input, select, textarea')) {
                    formElements.push(node);
                }
                
                formElements.forEach(element => {
                    if (!element.getAttribute('aria-label') && 
                        !element.getAttribute('aria-labelledby') && 
                        !element.getAttribute('title') && 
                        !element.closest('label') && 
                        !element.getAttribute('placeholder')) {
                        
                        // Try to generate a meaningful label from the element's attributes
                        const label = element.getAttribute('name') || 
                                    element.getAttribute('id') || 
                                    'Form Field';
                        const readableLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        element.setAttribute('aria-label', readableLabel);
                        console.log(`Added aria-label "${readableLabel}" to dynamically added element`);
                    }
                });
                
                // Also check for React Select button elements
                const reactSelectButtons = node.querySelectorAll ? node.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]') : [];
                if (node.matches && node.matches('button[aria-haspopup="listbox"], button[role="combobox"]')) {
                    reactSelectButtons.push(node);
                }
                
                reactSelectButtons.forEach(button => {
                    if (!button.getAttribute('aria-label') && 
                        !button.getAttribute('aria-labelledby') && 
                        !button.getAttribute('title')) {
                        
                        // Try to generate a meaningful label from the button's attributes
                        const label = button.getAttribute('aria-labelledby') || 
                                    button.getAttribute('id') || 
                                    'React Select';
                        const readableLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        button.setAttribute('aria-label', readableLabel);
                        console.log(`Added aria-label "${readableLabel}" to dynamically added React Select button`);
                    }
                });
            }
        });
    });
});

// Start observing the document for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Check existing elements on page load
function checkExistingElements() {
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        if (!element.getAttribute('aria-label') && 
            !element.getAttribute('aria-labelledby') && 
            !element.getAttribute('title') && 
            !element.closest('label') && 
            !element.getAttribute('placeholder')) {
            
            // Try to generate a meaningful label from the element's attributes
            const label = element.getAttribute('name') || 
                        element.getAttribute('id') || 
                        'Form Field';
            const readableLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            element.setAttribute('aria-label', readableLabel);
            console.log(`Added aria-label "${readableLabel}" to existing element`);
        }
    });
    
    // Also check React Select button elements
    const reactSelectButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
    reactSelectButtons.forEach(button => {
        if (!button.getAttribute('aria-label') && 
            !button.getAttribute('aria-labelledby') && 
            !button.getAttribute('title')) {
            
            // Try to generate a meaningful label from the button's attributes
            const label = button.getAttribute('aria-labelledby') || 
                        button.getAttribute('id') || 
                        'React Select';
            const readableLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            button.setAttribute('aria-label', readableLabel);
            console.log(`Added aria-label "${readableLabel}" to existing React Select button`);
        }
    });
}

// Run check when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkExistingElements);
} else {
    checkExistingElements();
}

// Site configurations - included directly to avoid import issues
const siteConfigurations = {
    'alliedtrustagents.com': {
        elementMappings: {
            // Customer info
            first_name: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsFirstName',
            last_name: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsLastName',
            dob: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_dtInsBirthDt',
            phone: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_InsHomePhone',
            email: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsEmail',
            address1: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyAddress1',
            address2: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtAddress2',
            city: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyCity',
            zip: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyZip',

            // Coverage values
            dA: 'ContentPlaceHolderBody_QuoteBody_txtDwellingCvg',
            dB: 'ContentPlaceHolderBody_QuoteBody_ddlCoverageBLimitCd',
            dC: 'ContentPlaceHolderBody_QuoteBody_ddlCoverageCLimitCd',
            dD: 'ContentPlaceHolderBody_QuoteBody_ddlLossOfUseCvgCd',
            dE: 'ContentPlaceHolderBody_QuoteBody_ddlLiabilityCvgCd',
            dF: 'ContentPlaceHolderBody_QuoteBody_ddlMedicalCvgCd',
            aop: 'ContentPlaceHolderBody_QuoteBody_ddlDeductibleAOPCd',
            wh: 'ContentPlaceHolderBody_QuoteBody_ddlDeductibleWindHailCd',

            // House info
            year_built: 'ContentPlaceHolderBody_QuoteBody_dtConstructionDt',
            purchase_date: 'ContentPlaceHolderBody_QuoteBody_dtHouseClosingDate',
            const_material: 'ContentPlaceHolderBody_QuoteBody_ddlConstructionTypeCd',
            foundation: 'ContentPlaceHolderBody_QuoteBody_ddlFoundationType',
            sqft: 'ContentPlaceHolderBody_QuoteBody_txtTotalAreaSqFt',
            st: 'ContentPlaceHolderBody_QuoteBody_ddlNbrFloorsCd',
            mat: 'ContentPlaceHolderBody_QuoteBody_ddlSidingType',
            roof_shape: 'ROOF_SHAPE_DROPDOWN',
            roof_mat: 'ContentPlaceHolderBody_QuoteBody_ddlRoofType',
            roof_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovRoofYear',
            roof_covering: 'ROOF_COVERING_DROPDOWN',

            // Unique to allied website
            payplan: 'ContentPlaceHolderBody_QuoteBody_ddlPaymentPlan',
            payor: 'ContentPlaceHolderBody_QuoteBody_ddlPayorCd',
            housesize: 'ContentPlaceHolderBody_QuoteBody_ddlHouseHoldSizeCd',
            personal_statues: 'ContentPlaceHolderBody_QuoteBody_ddlMarried',
            Inspermission: 'ContentPlaceHolderBody_QuoteBody_ddlHasAssentedtoCreditScore',
            Ins_score: 'ContentPlaceHolderBody_QuoteBody_ddlCreditScore',
            heater_location: 'ContentPlaceHolderBody_QuoteBody_ddlFirstWaterHeaterLocation',
            resident_type: 'ContentPlaceHolderBody_QuoteBody_ddlResidenceType',
            usage: 'ContentPlaceHolderBody_QuoteBody_ddlUsageType',
            water_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovationWaterHeaterYear',

            // Hard code no option for allied website
            option1: 'ContentPlaceHolderBody_QuoteBody_ddlAnyPersonalPropertyReplacementCvg',
            option2: 'ContentPlaceHolderBody_QuoteBody_ddlAnyBreakdownCvg',
            waterCov: 'ContentPlaceHolderBody_QuoteBody_HasPlumbingLeakageCoverage',
            lapse_coverage: 'LAPSE_COVERAGE_DROPDOWN',
        },
    },

    'agents.sagesure.com': {
        elementMappings: {
            // Customer info
            first_name: 'InsuredFirstName',
            last_name: 'InsuredLastName',
            dob: 'Insured1BirthDate',
            personal_statues: 'InsuredMaritalStatus',

            // Hard code Value
            dA: 'CoverageA',
            ddA: 'CoverageADisplay',

            // React Select fields  
            year_built: 'ConstructionYear',
            const_material: 'CONSTRUCTION_MATERIAL_DROPDOWN',
            c1: 'MasonryVeneerPercentage',
            roof_mat: 'RoofCoveringType',
            roof_year: 'ConstructionYearRoof',

            // Unique on Sagesure
            Ins_score: 'INSURANCE_SCORE_DROPDOWN',
            Laps: 'LAPS_DROPDOWN',
            Co_app: 'CoApplicantIndicator',
            PriorCarrier: 'PriorCarrierOther',
            x1: 'InsuranceScoreRangeEstimateIndicator',
            x2: 'Insured1SSNRequiredIndicator',
            x3: 'PersonalPropertyReplacementCost',
            x4: 'Trampoline'
        },
    },

    'isi.americanriskins.com': {
        elementMappings: {
            // Add American Risk Insurance (ARI) element mappings here
            first_name: 'firstName',
            last_name: 'lastName',
            dob: 'dob',
            // Add more mappings as they become available
        },
    },

    'cypress.cogisi.com': {
        elementMappings: {
            // Add Cypress element mappings here when you have them
            first_name: 'firstName',
            last_name: 'lastName',
            // Add more mappings as they become available
        },
    }
};

// Set up message listener for communication with the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    try {
        const currentDomain = window.location.hostname;
        let elementMappings = null;
        let domainMatch = '';

        // Find matching site configuration
        for (const [domain, config] of Object.entries(siteConfigurations)) {
            if (currentDomain.includes(domain)) {
                elementMappings = config.elementMappings;
                domainMatch = domain;
                break;
            }
        }

        if (!elementMappings) {
            console.error(`No configuration found for domain: ${currentDomain}`);
            sendResponse({ 
                status: 'Error', 
                message: `No configuration for site: ${currentDomain}. Make sure you're on a supported website.` 
            });
            return true;
        }

        console.log(`Domain matched: ${domainMatch}`);
        console.log('Received data:', request);

        // Process form filling
        fillFormFields(request, elementMappings, sendResponse);

        // Keep the message channel open for the async response
        return true;
    } catch (error) {
        console.error('Unexpected error in content script:', error);
        sendResponse({ 
            status: 'Error', 
            message: `Unexpected error: ${error.message}` 
        });
        return true;
    }
});

/**
 * Normalize React aria selector for better matching
 * @param {string} selector - The selector to normalize
 * @returns {string} - The normalized selector
 */
function normalizeReactAriaSelector(selector) {
    // Remove escape characters and normalize
    // For React aria selectors like 'react-aria5883214148-:r2d:', 
    // we want to keep the colons but remove any escape characters
    return selector.replace(/\\/g, '');
}

/**
 * Test React aria selector to see if it can find an element
 * @param {string} selector - The selector to test
 * @returns {Object} - Test results
 */
function testReactAriaSelector(selector) {
    const results = {
        selector: selector,
        found: false,
        element: null,
        approaches: []
    };
    
    try {
        const normalizedId = normalizeReactAriaSelector(selector);
        
        const approaches = [
            { name: 'Original selector', query: `#${selector}` },
            { name: 'Normalized selector', query: `#${normalizedId}` },
            { name: 'Escaped selector', query: `#${selector.replace(/\\/g, '\\\\').replace(/:/g, '\\:')}` },
            { name: 'CSS.escape', query: `#${CSS.escape ? CSS.escape(selector) : selector}` },
            { name: 'getElementById normalized', query: 'getElementById', id: normalizedId },
            { name: 'getElementById original', query: 'getElementById', id: selector }
        ];
        
        for (const approach of approaches) {
            try {
                let element = null;
                if (approach.query === 'getElementById') {
                    element = document.getElementById(approach.id);
                } else {
                    element = document.querySelector(approach.query);
                }
                
                results.approaches.push({
                    name: approach.name,
                    success: !!element,
                    element: element
                });
                
                if (element && !results.found) {
                    results.found = true;
                    results.element = element;
                }
            } catch (e) {
                results.approaches.push({
                    name: approach.name,
                    success: false,
                    error: e.message
                });
            }
        }
    } catch (error) {
        results.error = error.message;
    }
    
    return results;
}

/**
 * Find element using multiple strategies
 * @param {string} elementId - The element ID to find
 * @returns {Element|null} - The found element or null
 */
function findElement(elementId) {
    // Strategy 1: Direct ID selector
    let element = document.getElementById(elementId);
    if (element) {
        console.log(`Found element by ID: ${elementId}`);
        return element;
    }

    // Strategy 2: Query selector with ID (skip for React aria selectors with colons)
    if (!elementId.includes('react-aria') || !elementId.includes(':')) {
        try {
            element = document.querySelector(`#${elementId}`);
            if (element) {
                console.log(`Found element by query selector: #${elementId}`);
                return element;
            }
        } catch (e) {
            console.log(`Query selector failed for ${elementId}: ${e.message}`);
        }
    }

    // Strategy 3: Search by name attribute
    element = document.querySelector(`[name="${elementId}"]`);
    if (element) {
        console.log(`Found element by name: ${elementId}`);
        return element;
    }

    // Strategy 4: Search by partial ID match
    const partialMatches = document.querySelectorAll(`[id*="${elementId}"]`);
    if (partialMatches.length > 0) {
        console.log(`Found ${partialMatches.length} partial matches for: ${elementId}`);
        return partialMatches[0]; // Return first match
    }

    // Strategy 5: Search by partial name match
    const nameMatches = document.querySelectorAll(`[name*="${elementId}"]`);
    if (nameMatches.length > 0) {
        console.log(`Found ${nameMatches.length} name matches for: ${elementId}`);
        return nameMatches[0]; // Return first match
    }

    // Strategy 6: Search for input fields with similar names
    const inputs = document.querySelectorAll('input, select, textarea');
    for (const input of inputs) {
        const id = input.id || '';
        const name = input.name || '';
        const placeholder = input.placeholder || '';
        
        // Check if any attribute contains the elementId
        if (id.toLowerCase().includes(elementId.toLowerCase()) ||
            name.toLowerCase().includes(elementId.toLowerCase()) ||
            placeholder.toLowerCase().includes(elementId.toLowerCase())) {
            console.log(`Found element by attribute search: ${elementId} -> ${input.id || input.name}`);
            return input;
        }
    }

    // Strategy 7: Search for React Select button elements
    const buttons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
    for (const button of buttons) {
        const id = button.id || '';
        const ariaLabel = button.getAttribute('aria-label') || '';
        const ariaLabelledBy = button.getAttribute('aria-labelledby') || '';
        
        // Check if any attribute contains the elementId
        if (id.toLowerCase().includes(elementId.toLowerCase()) ||
            ariaLabel.toLowerCase().includes(elementId.toLowerCase()) ||
            ariaLabelledBy.toLowerCase().includes(elementId.toLowerCase())) {
            console.log(`Found React Select button by attribute search: ${elementId} -> ${button.id || button.getAttribute('aria-label')}`);
            return button;
        }
    }

    // Strategy 8: Handle special field identifiers
    if (elementId === 'CONSTRUCTION_MATERIAL_DROPDOWN') {
        console.log('Looking for construction material dropdown...');
        
        function getAriaLabelledByText(ariaLabelledBy) {
            if (!ariaLabelledBy) return '';
            const labelIds = ariaLabelledBy.split(' ');
            let labelText = '';
            for (const labelId of labelIds) {
                try {
                    const labelElement = document.getElementById(labelId);
                    if (labelElement) {
                        labelText += ' ' + (labelElement.textContent || labelElement.innerText || '');
                    }
                } catch (e) {}
            }
            return labelText.trim();
        }
        // 1. Check all React aria elements as before, but only for 'construction type'
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const ariaLabelledByText = getAriaLabelledByText(ariaLabelledBy).toLowerCase();
            const role = element.getAttribute('role') || '';
            const tagName = element.tagName.toLowerCase();
            if ((ariaLabel.includes('construction type') ||
                 ariaLabelledByText.includes('construction type')) &&
                (role === 'combobox' || tagName === 'button')) {
                console.log(`Found potential construction material element: ${element.id} (${ariaLabel || ariaLabelledByText})`);
                return element;
            }
        }
        // 2. Ancestor/sibling search: only match 'construction type'
        const allButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
        for (const button of allButtons) {
            let current = button.parentElement;
            let foundLabel = false;
            let labelText = '';
            for (let i = 0; i < 3 && current && !foundLabel; i++) {
                const possibleLabels = current.querySelectorAll('label, span, div, strong');
                for (const lbl of possibleLabels) {
                    labelText = (lbl.textContent || '').toLowerCase();
                    if (labelText.includes('construction type')) {
                        foundLabel = true;
                        break;
                    }
                }
                current = current.parentElement;
            }
            if (!foundLabel && button.previousElementSibling) {
                let sib = button.previousElementSibling;
                for (let j = 0; j < 3 && sib && !foundLabel; j++) {
                    if (sib.textContent && sib.textContent.toLowerCase().includes('construction type')) {
                        foundLabel = true;
                        break;
                    }
                    sib = sib.previousElementSibling;
                }
            }
            if (foundLabel) {
                console.log(`Found construction type dropdown by ancestor label: ${button.id}`);
                return button;
            }
        }
        // 3. Fallback: check for dropdown options as before
        const listboxButtons = document.querySelectorAll('button[aria-haspopup="listbox"]');
        for (const button of listboxButtons) {
            const dropdownOptions = document.querySelectorAll('[role="option"]');
            let hasConstructionOptions = false;
            for (const option of dropdownOptions) {
                const optionText = option.textContent || option.innerText || '';
                if (optionText.toLowerCase().includes('frame') || 
                    optionText.toLowerCase().includes('masonry') ||
                    optionText.toLowerCase().includes('metal') ||
                    optionText.toLowerCase().includes('manufactured')) {
                    hasConstructionOptions = true;
                    break;
                }
            }
            if (hasConstructionOptions) {
                console.log(`Found dropdown with construction options: ${button.id}`);
                return button;
            }
        }
        console.log('No construction material dropdown found');
        return null;
    }
    
    // Handle insurance score dropdown
    if (elementId === 'INSURANCE_SCORE_DROPDOWN') {
        console.log('Looking for insurance score dropdown...');
        
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = element.getAttribute('aria-label') || '';
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const role = element.getAttribute('role') || '';
            
            if ((ariaLabel.toLowerCase().includes('insurance') || 
                 ariaLabel.toLowerCase().includes('score') ||
                 ariaLabelledBy.toLowerCase().includes('insurance') ||
                 ariaLabelledBy.toLowerCase().includes('score')) &&
                (role === 'combobox' || element.tagName.toLowerCase() === 'button')) {
                console.log(`Found potential insurance score element: ${element.id} (${ariaLabel || ariaLabelledBy})`);
                return element;
            }
        }
        
        console.log('No insurance score dropdown found');
        return null;
    }
    
    // Handle LAPS dropdown
    if (elementId === 'LAPS_DROPDOWN') {
        console.log('Looking for LAPS dropdown...');
        
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = element.getAttribute('aria-label') || '';
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const role = element.getAttribute('role') || '';
            
            if ((ariaLabel.toLowerCase().includes('laps') || 
                 ariaLabelledBy.toLowerCase().includes('laps')) &&
                (role === 'combobox' || element.tagName.toLowerCase() === 'button')) {
                console.log(`Found potential LAPS element: ${element.id} (${ariaLabel || ariaLabelledBy})`);
                return element;
            }
        }
        
        console.log('No LAPS dropdown found');
        return null;
    }

    if (elementId === 'INSURANCE_SCORE_ESTIMATE_DROPDOWN') {
        const targetLabel = 'insurance score estimate';
        // 1. aria-label/aria-labelledby
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = (element.getAttribute('aria-label') || '').replace(/\*/g, '').trim().toLowerCase();
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const ariaLabelledByText = getAriaLabelledByText(ariaLabelledBy).replace(/\*/g, '').trim().toLowerCase();
            const role = element.getAttribute('role') || '';
            const tagName = element.tagName.toLowerCase();
            if ((ariaLabel === targetLabel || ariaLabelledByText === targetLabel) && (role === 'combobox' || tagName === 'button')) {
                console.log(`Found insurance score estimate dropdown: ${element.id}`);
                return element;
            }
        }
        // 2. Ancestor/sibling
        const allButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
        for (const button of allButtons) {
            let current = button.parentElement;
            let foundLabel = false;
            let labelText = '';
            for (let i = 0; i < 3 && current && !foundLabel; i++) {
                const possibleLabels = current.querySelectorAll('label, span, div, strong');
                for (const lbl of possibleLabels) {
                    labelText = (lbl.textContent || '').replace(/\*/g, '').trim().toLowerCase();
                    if (labelText === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                }
                current = current.parentElement;
            }
            if (!foundLabel && button.previousElementSibling) {
                let sib = button.previousElementSibling;
                for (let j = 0; j < 3 && sib && !foundLabel; j++) {
                    if (sib.textContent && sib.textContent.replace(/\*/g, '').trim().toLowerCase() === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                    sib = sib.previousElementSibling;
                }
            }
            if (foundLabel) {
                console.log(`Found insurance score estimate dropdown by ancestor label: ${button.id}`);
                return button;
            }
        }
        return null;
    }
    
    // Strategy 9: Search for React aria ID selectors (handle escaped characters)
    if (elementId.includes('react-aria') || elementId.includes('\\:')) {
        console.log(`Processing React aria selector: ${elementId}`);
        try {
            // Normalize the selector
            const normalizedId = normalizeReactAriaSelector(elementId);
            
            // Try multiple approaches to find the element
            const approaches = [
                // Approach 1: Try getElementById with original ID (safest first)
                () => document.getElementById(elementId),
                // Approach 2: Try getElementById with normalized ID
                () => document.getElementById(normalizedId),
                // Approach 3: Try with CSS.escape if available
                () => {
                    if (CSS.escape) {
                        return document.querySelector(`#${CSS.escape(elementId)}`);
                    }
                    return null;
                },
                // Approach 4: Try with escaped selector
                () => {
                    const escapedId = elementId.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
                    return document.querySelector(`#${escapedId}`);
                }
            ];
            
            for (let i = 0; i < approaches.length; i++) {
                try {
                    const element = approaches[i]();
                    if (element) {
                        console.log(`Found React aria element by approach ${i + 1}: ${elementId}`);
                        return element;
                    }
                } catch (e) {
                    console.log(`Approach ${i + 1} failed for ${elementId}: ${e.message}`);
                    // Continue to next approach
                }
            }
            
            // Approach 7: Try partial match for React aria IDs
            const reactAriaMatches = document.querySelectorAll('[id*="react-aria"]');
            for (const match of reactAriaMatches) {
                const matchId = match.id;
                const normalizedMatchId = normalizeReactAriaSelector(matchId);
                const normalizedElementId = normalizeReactAriaSelector(elementId);
                
                if (matchId.includes(normalizedElementId) || 
                    normalizedMatchId.includes(normalizedElementId) ||
                    matchId.includes(elementId.replace(/\\/g, ''))) {
                    console.log(`Found React aria element by partial match: ${elementId} -> ${matchId}`);
                    return match;
                }
            }
            
            // Approach 6: Try to find by aria-labelledby if the selector contains a label reference
            if (elementId.includes('Type')) {
                const typeButtons = document.querySelectorAll('button[aria-haspopup="listbox"]');
                for (const button of typeButtons) {
                    const ariaLabelledBy = button.getAttribute('aria-labelledby') || '';
                    if (ariaLabelledBy.includes('Type') || 
                        button.id.includes('react-aria') && button.id.includes('Type')) {
                        console.log(`Found React aria element by Type keyword: ${elementId} -> ${button.id}`);
                        return button;
                    }
                }
            }
            
            // Approach 5: Try to find by extracting the unique part of the React aria ID
            // For selectors like 'react-aria5883214148-:r2d:', extract '5883214148' and search for it
            const reactAriaMatch = elementId.match(/react-aria(\d+)/);
            if (reactAriaMatch) {
                const uniqueId = reactAriaMatch[1];
                console.log(`Extracted unique ID: ${uniqueId} from ${elementId}`);
                const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
                console.log(`Found ${allReactAriaElements.length} React aria elements on page`);
                for (const element of allReactAriaElements) {
                    console.log(`Checking element: ${element.id}`);
                    if (element.id.includes(uniqueId)) {
                        console.log(`Found React aria element by unique ID match: ${elementId} -> ${element.id}`);
                        return element;
                    }
                }
            }
            
            // Approach 6: Try to find by searching all React aria elements and matching by context
            // This is useful for construction material fields which might be dropdowns
            if (elementId.includes('const_material') || elementId.includes('material') || elementId.includes('construction')) {
                const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
                for (const element of allReactAriaElements) {
                    // Look for elements that might be construction material dropdowns
                    const ariaLabel = element.getAttribute('aria-label') || '';
                    const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
                    const role = element.getAttribute('role') || '';
                    
                    if (ariaLabel.toLowerCase().includes('construction') || 
                        ariaLabel.toLowerCase().includes('material') ||
                        ariaLabelledBy.toLowerCase().includes('construction') ||
                        ariaLabelledBy.toLowerCase().includes('material') ||
                        (role === 'combobox' && (ariaLabel || ariaLabelledBy))) {
                        console.log(`Found potential construction material element: ${element.id} (${ariaLabel || ariaLabelledBy})`);
                        return element;
                    }
                }
            }
            
            // Approach 7: Generic React aria pattern matcher for any dynamic selectors
            // This handles cases where we have a pattern like 'react-ariaXXXXX-:r2d:' but the number changes
            const reactAriaPattern = elementId.match(/^react-aria(\d+)-:r(\w+):$/);
            if (reactAriaPattern) {
                const [, numberPart, suffixPart] = reactAriaPattern;
                console.log(`Looking for React aria pattern: react-aria${numberPart}-:r${suffixPart}:`);
                
                // Find all React aria elements and look for ones with the same suffix pattern
                const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
                for (const element of allReactAriaElements) {
                    const elementId = element.id;
                    const elementPattern = elementId.match(/^react-aria(\d+)-:r(\w+):$/);
                    
                    if (elementPattern && elementPattern[2] === suffixPart) {
                        console.log(`Found React aria element with matching suffix pattern: ${elementId}`);
                        return element;
                    }
                }
            }
            
        } catch (error) {
            console.warn(`Error with React aria selector ${elementId}:`, error);
        }
    }

    if (elementId === 'ROOF_SHAPE_DROPDOWN') {
        const targetLabel = 'roof shape';
        // 1. aria-label/aria-labelledby
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = (element.getAttribute('aria-label') || '').replace(/\*/g, '').trim().toLowerCase();
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const ariaLabelledByText = getAriaLabelledByText(ariaLabelledBy).replace(/\*/g, '').trim().toLowerCase();
            const role = element.getAttribute('role') || '';
            const tagName = element.tagName.toLowerCase();
            if ((ariaLabel === targetLabel || ariaLabelledByText === targetLabel) && (role === 'combobox' || tagName === 'button')) {
                console.log(`Found roof shape dropdown: ${element.id}`);
                return element;
            }
        }
        // 2. Ancestor/sibling
        const allButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
        for (const button of allButtons) {
            let current = button.parentElement;
            let foundLabel = false;
            let labelText = '';
            for (let i = 0; i < 3 && current && !foundLabel; i++) {
                const possibleLabels = current.querySelectorAll('label, span, div, strong');
                for (const lbl of possibleLabels) {
                    labelText = (lbl.textContent || '').replace(/\*/g, '').trim().toLowerCase();
                    if (labelText === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                }
                current = current.parentElement;
            }
            if (!foundLabel && button.previousElementSibling) {
                let sib = button.previousElementSibling;
                for (let j = 0; j < 3 && sib && !foundLabel; j++) {
                    if (sib.textContent && sib.textContent.replace(/\*/g, '').trim().toLowerCase() === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                    sib = sib.previousElementSibling;
                }
            }
            if (foundLabel) {
                console.log(`Found roof shape dropdown by ancestor label: ${button.id}`);
                return button;
            }
        }
        return null;
    }

    if (elementId === 'ROOF_COVERING_DROPDOWN') {
        const targetLabel = 'roof covering type';
        // 1. aria-label/aria-labelledby
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = (element.getAttribute('aria-label') || '').replace(/\*/g, '').trim().toLowerCase();
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const ariaLabelledByText = getAriaLabelledByText(ariaLabelledBy).replace(/\*/g, '').trim().toLowerCase();
            const role = element.getAttribute('role') || '';
            const tagName = element.tagName.toLowerCase();
            if ((ariaLabel === targetLabel || ariaLabelledByText === targetLabel) && (role === 'combobox' || tagName === 'button')) {
                console.log(`Found roof covering type dropdown: ${element.id}`);
                return element;
            }
        }
        // 2. Ancestor/sibling
        const allButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
        for (const button of allButtons) {
            let current = button.parentElement;
            let foundLabel = false;
            let labelText = '';
            for (let i = 0; i < 3 && current && !foundLabel; i++) {
                const possibleLabels = current.querySelectorAll('label, span, div, strong');
                for (const lbl of possibleLabels) {
                    labelText = (lbl.textContent || '').replace(/\*/g, '').trim().toLowerCase();
                    if (labelText === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                }
                current = current.parentElement;
            }
            if (!foundLabel && button.previousElementSibling) {
                let sib = button.previousElementSibling;
                for (let j = 0; j < 3 && sib && !foundLabel; j++) {
                    if (sib.textContent && sib.textContent.replace(/\*/g, '').trim().toLowerCase() === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                    sib = sib.previousElementSibling;
                }
            }
            if (foundLabel) {
                console.log(`Found roof covering type dropdown by ancestor label: ${button.id}`);
                return button;
            }
        }
        return null;
    }

    if (elementId === 'LAPSE_COVERAGE_DROPDOWN') {
        const targetLabel = 'lapse in coverage last 3 years?';
        // 1. aria-label/aria-labelledby
        const allReactAriaElements = document.querySelectorAll('[id*="react-aria"]');
        for (const element of allReactAriaElements) {
            const ariaLabel = (element.getAttribute('aria-label') || '').replace(/\*/g, '').trim().toLowerCase();
            const ariaLabelledBy = element.getAttribute('aria-labelledby') || '';
            const ariaLabelledByText = getAriaLabelledByText(ariaLabelledBy).replace(/\*/g, '').trim().toLowerCase();
            const role = element.getAttribute('role') || '';
            const tagName = element.tagName.toLowerCase();
            if ((ariaLabel === targetLabel || ariaLabelledByText === targetLabel) && (role === 'combobox' || tagName === 'button')) {
                console.log(`Found lapse in coverage dropdown: ${element.id}`);
                return element;
            }
        }
        // 2. Ancestor/sibling
        const allButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
        for (const button of allButtons) {
            let current = button.parentElement;
            let foundLabel = false;
            let labelText = '';
            for (let i = 0; i < 3 && current && !foundLabel; i++) {
                const possibleLabels = current.querySelectorAll('label, span, div, strong');
                for (const lbl of possibleLabels) {
                    labelText = (lbl.textContent || '').replace(/\*/g, '').trim().toLowerCase();
                    if (labelText === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                }
                current = current.parentElement;
            }
            if (!foundLabel && button.previousElementSibling) {
                let sib = button.previousElementSibling;
                for (let j = 0; j < 3 && sib && !foundLabel; j++) {
                    if (sib.textContent && sib.textContent.replace(/\*/g, '').trim().toLowerCase() === targetLabel) {
                        foundLabel = true;
                        break;
                    }
                    sib = sib.previousElementSibling;
                }
            }
            if (foundLabel) {
                console.log(`Found lapse in coverage dropdown by ancestor label: ${button.id}`);
                return button;
            }
        }
        return null;
    }

    // Strategy 10: Search for any button with similar ID patterns
    const allButtons = document.querySelectorAll('button');
    for (const button of allButtons) {
        const id = button.id || '';
        const className = button.className || '';
        
        // Check if button ID contains the elementId or if it's a React Select component
        if (id.toLowerCase().includes(elementId.toLowerCase()) ||
            (className.includes('react') && className.includes('select'))) {
            console.log(`Found button by ID/class search: ${elementId} -> ${button.id || button.className}`);
            return button;
        }
    }

    console.log(`Element not found: ${elementId}`);
    return null;
}

/**
 * Fill React Select button element
 * @param {Element} button - The React Select button element
 * @param {string} value - The value to select
 * @param {string} fieldName - The field name for logging
 */
async function fillReactSelectButton(button, value, fieldName) {
    try {
        console.log(`Filling React Select button for ${fieldName} with value: ${value}`);
        
        // Click the button to open the dropdown
        button.click();
        
        // Wait a bit for the dropdown to open
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Look for the dropdown options
        const dropdownOptions = document.querySelectorAll('[role="option"], [data-option], .react-select__option');
        
        // Try to find the option that matches our value
        let targetOption = null;
        for (const option of dropdownOptions) {
            const optionText = option.textContent || option.getAttribute('data-value') || '';
            const optionValue = option.getAttribute('value') || option.getAttribute('data-value') || optionText;
            
            if (optionText.toLowerCase().includes(value.toLowerCase()) ||
                optionValue.toLowerCase().includes(value.toLowerCase())) {
                targetOption = option;
                break;
            }
        }
        
        if (targetOption) {
            // Click the target option
            targetOption.click();
            console.log(`Selected option "${targetOption.textContent}" for ${fieldName}`);
            
            // Wait a bit for the selection to register
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Trigger change events
            button.dispatchEvent(new Event('change', { bubbles: true }));
            button.dispatchEvent(new Event('input', { bubbles: true }));
            
            return true;
        } else {
            console.warn(`No matching option found for value "${value}" in ${fieldName}`);
            return false;
        }
    } catch (error) {
        console.error(`Error filling React Select button for ${fieldName}:`, error);
        return false;
    }
}

/**
 * Ensure element has proper accessibility attributes
 * @param {Element} element - The element to check
 * @param {string} fieldName - The field name for generating aria-label
 */
function ensureAccessibility(element, fieldName) {
    // Check if element has proper accessibility attributes
    const hasLabel = element.getAttribute('aria-label') || 
                    element.getAttribute('aria-labelledby') ||
                    element.getAttribute('title') ||
                    element.closest('label') ||
                    element.getAttribute('placeholder');
    
    // If no accessibility attributes found, add aria-label
    if (!hasLabel && element.tagName !== 'OPTION') {
        const readableName = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        element.setAttribute('aria-label', readableName);
        console.log(`Added aria-label "${readableName}" to element ${element.id || element.name || 'unnamed'}`);
    }
    
    // Handle React Select components specifically
    if (element.classList.contains('react-select__input') || 
        element.closest('.react-select__control') ||
        element.getAttribute('data-react-select')) {
        
        // Find the React Select container
        const selectContainer = element.closest('.react-select__control') || 
                               element.closest('[data-react-select]') ||
                               element.parentElement;
        
        if (selectContainer && !selectContainer.getAttribute('aria-label')) {
            const readableName = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            selectContainer.setAttribute('aria-label', readableName);
            console.log(`Added aria-label "${readableName}" to React Select container`);
        }
    }
}

/**
 * Debug function to log all form elements on the page
 */
function debugFormElements() {
    console.log('=== DEBUG: All form elements on page ===');
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
        console.log(`${index + 1}. ID: "${input.id}", Name: "${input.name}", Type: "${input.type}", Placeholder: "${input.placeholder}"`);
    });
    
    // Also log React Select button elements
    const reactSelectButtons = document.querySelectorAll('button[aria-haspopup="listbox"], button[role="combobox"]');
    reactSelectButtons.forEach((button, index) => {
        console.log(`React Select ${index + 1}. ID: "${button.id}", Aria-label: "${button.getAttribute('aria-label')}", Aria-labelledby: "${button.getAttribute('aria-labelledby')}"`);
    });
    
    // Log all React aria elements
    const reactAriaElements = document.querySelectorAll('[id*="react-aria"]');
    reactAriaElements.forEach((element, index) => {
        console.log(`React Aria ${index + 1}. ID: "${element.id}", Tag: "${element.tagName}", Aria-haspopup: "${element.getAttribute('aria-haspopup')}", Aria-labelledby: "${element.getAttribute('aria-labelledby')}"`);
    });
    
    console.log('=== END DEBUG ===');
}

/**
 * Fill form fields with provided data
 * @param {Object} formData - The form data to fill
 * @param {Object} elementMappings - Element ID mappings
 * @param {Function} sendResponse - Response callback
 */
async function fillFormFields(formData, elementMappings, sendResponse) {
    let filledFields = 0;
    let notFoundElements = [];
    let failedFields = [];

    try {
        // Debug: Log all form elements on the page
        debugFormElements();

        // Process each field mapping
        const fillPromises = Object.entries(elementMappings).map(async ([key, elementId]) => {
            // Skip if we don't have a value for this field
            if (formData[key] === undefined || formData[key] === '') {
                return;
            }

            const element = findElement(elementId);

            if (element) {
                console.log(`Processing ${key}: ${formData[key]} -> ${elementId}`);
                try {
                    // Ensure element has proper accessibility attributes
                    ensureAccessibility(element, key);
                    
                    // Check if this is a React Select button
                    if (element.tagName === 'BUTTON' && 
                        (element.getAttribute('aria-haspopup') === 'listbox' || 
                         element.getAttribute('role') === 'combobox' ||
                         element.className.includes('react'))) {
                        
                        // Handle React Select button
                        const success = await fillReactSelectButton(element, formData[key], key);
                        if (success) {
                            filledFields++;
                        } else {
                            failedFields.push({ key, elementId, error: 'Failed to select option in React Select' });
                        }
                    } else {
                        // Handle regular form elements
                        element.value = formData[key];
                        
                        // Trigger change event for React/JavaScript frameworks
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        filledFields++;
                    }
                } catch (err) {
                    console.error(`Error filling field ${key}:`, err);
                    failedFields.push({ key, elementId, error: err.message });
                }
            } else {
                console.log(`Element not found: ${elementId} for ${key}`);
                notFoundElements.push({ key, elementId });
            }
        });

        // Wait for all fill operations to complete
        await Promise.all(fillPromises);
        
        const message = `${filledFields} fields filled successfully.`;
        const details = [];
        
        if (notFoundElements.length > 0) {
            details.push(`${notFoundElements.length} elements not found on page.`);
            console.log('Not found elements:', notFoundElements);
        }
        
        if (failedFields.length > 0) {
            details.push(`${failedFields.length} fields failed to fill correctly.`);
            console.log('Failed fields:', failedFields);
        }
        
        sendResponse({
            status: 'Success',
            message: message + (details.length > 0 ? ' ' + details.join(' ') : ''),
            notFoundElements: notFoundElements,
            failedFields: failedFields,
            filledFields: filledFields
        });
    } catch (error) {
        console.error('Error in fill promises:', error);
        sendResponse({ 
            status: 'Error', 
            message: `Error filling fields: ${error.message}` 
        });
    }
}