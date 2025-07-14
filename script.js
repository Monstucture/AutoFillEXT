/**
 * AutoFillEXT - Chrome Extension for Auto-filling Insurance Quotes
 * Main popup script with improved error handling and modular structure
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    const app = new AutoFillApp();
    app.init();
});

class AutoFillApp {
    constructor() {
        this.formElements = {};
        this.currentSite = 'allied';
        this.siteConfigurations = this.getSiteConfigurations();
        this.formIds = this.getFormIds();
    }

    /**
     * Initialize the application
     */
    init() {
        try {
            this.initializeFormElements();
            this.setupEventListeners();
            this.initializeForm();
            console.log('AutoFillEXT initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AutoFillEXT:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Get list of form element IDs
     */
    getFormIds() {
        return [
            'autofill', 'reset-fields', 'save', 'load', 'site-selection',
            'first_name', 'last_name', 'dob', 'phone', 'email',
            'address1', 'address2', 'city', 'zip',
            'dA', 'ddA', 'dB', 'dC', 'dD', 'dE', 'dF', 'aop', 'wh',
            'year_built', 'purchase_date', 'const_material', 'foundation', 'sqft', 
            'st', 'mat', 'roof_shape', 'roof_mat', 'roof_year', 'water_year',
            'payplan', 'payor', 'housesize', 'personal_statues', 'Inspermission', 
            'Ins_score', 'heater_location', 'resident_type', 'usage',
            'option1', 'option2', 'waterCov', 'Laps', 'Co_app', 'PriorCarrier',
            'x1', 'x2', 'x3', 'x4', 'c1'
        ];
    }

    /**
     * Get site configurations
     */
    getSiteConfigurations() {
        return {
            allied: {
                dB: '2', dC: '0', dD: '0', dE: '1', dF: '2',
                aop: '8', wh: '4', foundation: '2', payplan: '0',
                payor: '0', housesize: '2', personal_statues: '1',
                Inspermission: '1', Ins_score: '10', heater_location: '1',
                resident_type: '0', usage: '0', option1: '0',
                option2: '0', waterCov: '1',
                roof_mat: [
                    { value: '1', label: 'Architectural Shingles' },
                    { value: '0', label: 'Asphalt/Composite Shingles' }
                ],
                roof_shape: [
                    { value: '0', label: 'Gable' },
                    { value: '7', label: 'Hip' }
                ],
                const_material: [
                    { value: '1', label: 'Brick' },
                    { value: '0', label: 'Frame' }
                ],
                mat: [
                    { value: '2', label: 'Brick' },
                    { value: '9', label: 'Vinyl' }
                ]
            },
            sagesure: {
                Ins_score: 'Average', Laps: 'None', Co_app: '200',
                PriorCarrier: 'Other', x1: '200', x2: '200',
                x3: '200', x4: '200', c1: '0 - 9%',
                personal_statues: 'Single',
                roof_mat: [
                    { value: 'Architectural Shingles', label: 'Architectural Shingles' },
                    { value: 'Asphalt/Composite Shingles', label: 'Asphalt/Composite Shingles' }
                ],
                const_material: [
                    { value: 'Masonry Veneer', label: 'Masonry Veneer' },
                    { value: 'Frame', label: 'Frame' }
                ],
                mat: [
                    { value: 'Brick Veneer', label: 'Brick' },
                    { value: 'Vinyl', label: 'Vinyl' }
                ]
            },
            ari: {
                personal_statues: 'Single',
                roof_mat: [
                    { value: 'Architectural Shingles', label: 'Architectural Shingles' },
                    { value: 'Asphalt/Composite Shingles', label: 'Asphalt/Composite Shingles' }
                ],
                const_material: [
                    { value: 'Frame', label: 'Frame' },
                    { value: 'Brick', label: 'Brick' }
                ],
                mat: [
                    { value: 'Brick', label: 'Brick' },
                    { value: 'Vinyl', label: 'Vinyl' }
                ]
            }
        };
    }

    /**
     * Initialize form elements
     */
    initializeFormElements() {
        this.formIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.formElements[id] = element;
            } else {
                console.warn(`Element with id "${id}" not found`);
            }
        });

        if (Object.keys(this.formElements).length === 0) {
            throw new Error('No form elements found');
        }

        // Set current site from selection
        if (this.formElements['site-selection']) {
            this.currentSite = this.formElements['site-selection'].value;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const eventMap = {
            'autofill': this.handleAutofill.bind(this),
            'reset-fields': this.handleReset.bind(this),
            'save': this.handleSave.bind(this),
            'load': this.handleLoad.bind(this),
            'site-selection': this.handleSiteChange.bind(this)
        };

        Object.entries(eventMap).forEach(([id, handler]) => {
            if (this.formElements[id]) {
                const eventType = id === 'site-selection' ? 'change' : 'click';
                this.formElements[id].addEventListener(eventType, handler);
            }
        });
    }

    /**
     * Initialize form with default values
     */
    initializeForm() {
        this.initializeFixedValues();
        this.updateSelectOptions(['roof_mat', 'roof_shape', 'const_material', 'mat']);
    }

    /**
     * Initialize fixed values for current site
     */
    initializeFixedValues() {
        const config = this.siteConfigurations[this.currentSite];
        if (!config) {
            console.error(`No configuration found for site: ${this.currentSite}`);
            return;
        }

        Object.entries(config).forEach(([key, value]) => {
            if (this.formElements[key] && typeof value !== 'object') {
                // Only set fixed values if the field is empty or if it's a fixed field
                const element = this.formElements[key];
                if (element.value === '' || this.isFixedField(key)) {
                    element.value = value;
                    console.log(`Set fixed value for ${key}: ${value}`);
                }
            }
        });
    }

    /**
     * Check if a field is a fixed field that should always be set
     */
    isFixedField(key) {
        const fixedFields = [
            'dB', 'dC', 'dD', 'dE', 'dF', 'aop', 'wh', 'foundation', 
            'payplan', 'payor', 'housesize', 'personal_statues', 
            'Inspermission', 'Ins_score', 'heater_location', 
            'resident_type', 'usage', 'option1', 'option2', 'waterCov',
            'Laps', 'Co_app', 'PriorCarrier', 'x1', 'x2', 'x3', 'x4', 'c1'
        ];
        return fixedFields.includes(key);
    }

    /**
     * Update select options for current site
     */
    updateSelectOptions(selectIds) {
        selectIds.forEach(selectId => {
            const selectElement = this.formElements[selectId];
            if (!selectElement) {
                console.warn(`Select element ${selectId} not found`);
                return;
            }

            const currentOptions = this.siteConfigurations[this.currentSite][selectId];
            if (!currentOptions) {
                console.warn(`No options found for ${selectId} in current site configuration`);
                return;
            }

            // Store current value if it exists
            const currentValue = selectElement.value;

            // Clear existing options
            selectElement.innerHTML = '';

            // Add default empty option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `Select ${selectId.replace(/_/g, ' ')}`;
            selectElement.appendChild(defaultOption);

            // Add new options
            currentOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                selectElement.appendChild(optionElement);
            });

            // Restore value if it was set and still exists in new options
            if (currentValue && currentValue !== '') {
                const optionExists = Array.from(selectElement.options).some(option => 
                    option.value === currentValue
                );
                if (optionExists) {
                    selectElement.value = currentValue;
                    console.log(`Restored value for ${selectId}: ${currentValue}`);
                }
            }
        });
    }

    /**
     * Handle site change
     */
    handleSiteChange(event) {
        this.currentSite = event.target.value;
        this.initializeFixedValues();
        this.updateSelectOptions(['roof_mat', 'roof_shape', 'const_material', 'mat']);
        console.log(`Site changed to: ${this.currentSite}`);
    }

    /**
     * Handle autofill button click
     */
    async handleAutofill() {
        try {
            console.log('Starting autofill process...');
            
            // Check if we're on a supported site
            const tabs = await this.queryActiveTab();
            if (!tabs || tabs.length === 0) {
                throw new Error('No active tab found');
            }

            const currentUrl = tabs[0].url;
            console.log('Current URL:', currentUrl);

            // Check if we're on a supported domain
            const supportedDomains = [
                'alliedtrustagents.com',
                'agents.sagesure.com', 
                'isi.americanriskins.com',
                'cypress.cogisi.com'
            ];

            const isSupported = supportedDomains.some(domain => currentUrl.includes(domain));
            if (!isSupported) {
                throw new Error(`Not on a supported website. Please navigate to one of: ${supportedDomains.join(', ')}`);
            }

            const formData = this.getFormData();
            console.log('Sending form data:', formData);

            const response = await this.sendMessageToTab(formData);
            this.handleAutofillResponse(response);
            
        } catch (error) {
            console.error('Autofill error:', error);
            this.showError(`Autofill failed: ${error.message}`);
        }
    }

    /**
     * Query active tab
     */
    queryActiveTab() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(tabs);
                }
            });
        });
    }

    /**
     * Send message to tab via background script
     */
    sendMessageToTab(data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'autofill',
                data: data
            }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (!response) {
                    reject(new Error('No response received from content script'));
                } else {
                    resolve(response);
                }
            });
        });
    }

    /**
     * Handle autofill response
     */
    handleAutofillResponse(response) {
        if (response.status === 'Success') {
            console.log('Autofill successful:', response);
            this.showSuccess(`Autofill successful! ${response.message}`);
        } else {
            console.error('Autofill failed:', response);
            this.showError(`Autofill failed: ${response.message}`);
        }
    }

    /**
     * Handle reset button click
     */
    handleReset() {
        try {
            console.log('Resetting form...');
            
            const config = this.siteConfigurations[this.currentSite];
            
            // Reset only user-editable fields, not fixed values
            Object.entries(this.formElements).forEach(([key, element]) => {
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                    if (!config || !config.hasOwnProperty(key)) {
                        element.value = '';
                    }
                }
            });
            
            this.initializeFixedValues();
            this.updateSelectOptions(['roof_mat', 'roof_shape', 'const_material', 'mat']);
            
            console.log('Form reset successfully');
            this.showSuccess('Form reset successfully');
            
        } catch (error) {
            console.error('Reset error:', error);
            this.showError(`Reset failed: ${error.message}`);
        }
    }

    /**
     * Handle save button click
     */
    async handleSave() {
        try {
            console.log('Saving form data...');
            
            const dataToSave = this.getFormData();
            
            await this.saveToStorage(dataToSave);
            console.log('Data saved successfully');
            this.showSuccess('Data saved successfully');
            
        } catch (error) {
            console.error('Save error:', error);
            this.showError(`Save failed: ${error.message}`);
        }
    }

    /**
     * Save data to chrome storage
     */
    saveToStorage(data) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Handle load button click
     */
    async handleLoad() {
        try {
            console.log('Loading saved data...');
            
            const result = await this.loadFromStorage();
            
            // Update site selection first if it exists in saved data
            if (result.site && this.formElements['site-selection']) {
                this.formElements['site-selection'].value = result.site;
                this.currentSite = result.site;
            }
            
            // Update select options first to ensure they're available
            this.updateSelectOptions(['roof_mat', 'roof_shape', 'const_material', 'mat']);
            
            // Initialize fixed values (but don't overwrite loaded values)
            this.initializeFixedValues();
            
            // Now load all form values, including select elements
            Object.entries(this.formElements).forEach(([key, element]) => {
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                    if (result[key] !== undefined && result[key] !== '') {
                        // For select elements, verify the option exists before setting
                        if (element.tagName === 'SELECT') {
                            const optionExists = Array.from(element.options).some(option => 
                                option.value === result[key]
                            );
                            if (optionExists) {
                                element.value = result[key];
                                console.log(`Set select ${key} to: ${result[key]}`);
                            } else {
                                console.log(`Option not found for ${key}: ${result[key]}`);
                            }
                        } else {
                            element.value = result[key];
                            console.log(`Set input ${key} to: ${result[key]}`);
                        }
                    }
                }
            });
            
            console.log('Data loaded successfully');
            this.showSuccess('Data loaded successfully');
            
        } catch (error) {
            console.error('Load error:', error);
            this.showError(`Load failed: ${error.message}`);
        }
    }

    /**
     * Load data from chrome storage
     */
    loadFromStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Get form data
     */
    getFormData() {
        const formData = { site: this.currentSite };
        
        Object.entries(this.formElements).forEach(([key, element]) => {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                formData[key] = element.value.trim();
            }
        });
        
        console.log('Form data:', formData);
        return formData;
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        alert(`✅ ${message}`);
    }

    /**
     * Show error message
     */
    showError(message) {
        alert(`❌ ${message}`);
    }
}