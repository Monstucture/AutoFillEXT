// Initialize the content script
console.log('AutoFillEXT content script initialized');

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
            roof_shape: 'ContentPlaceHolderBody_QuoteBody_ddlRoofShapeCd',
            roof_mat: 'ContentPlaceHolderBody_QuoteBody_ddlRoofType',
            roof_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovRoofYear',

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
            const_material: 'ConstructionType',
            c1: 'MasonryVeneerPercentage',
            roof_mat: 'RoofCoveringType',
            roof_year: 'ConstructionYearRoof',

            // Unique on Sagesure
            Ins_score: 'InsuranceScoreRangeEstimate',
            Laps: 'LapseInCoverage',
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

    // Strategy 2: Query selector with ID
    element = document.querySelector(`#${elementId}`);
    if (element) {
        console.log(`Found element by query selector: #${elementId}`);
        return element;
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

    console.log(`Element not found: ${elementId}`);
    return null;
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
                    element.value = formData[key];
                    
                    // Trigger change event for React/JavaScript frameworks
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    filledFields++;
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