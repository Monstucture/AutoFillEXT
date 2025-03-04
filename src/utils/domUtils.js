import { isReactSelect, fillReactSelect, selectRadioButton } from './reactUtils';

export function getCurrentDomain() {
    return window.location.hostname;
}

export function findElement(elementId) {
    let element = document.getElementById(elementId) || document.getElementsByName(elementId)[0];

    if (element) {
        return element;
    }

    // Check for React Select container
    const reactSelectContainer = document.getElementById(`${elementId}-container`);
    if (reactSelectContainer) {
        return { isReactSelect: true, containerId: `${elementId}-container` };
    }

    return null;
}

export function fillField(element, value, site, key, siteConfigurations) {
    console.log(`Attempting to fill ${key} with value: ${value}`);

    const siteConfig = siteConfigurations[site];
    if (siteConfig && siteConfig.valueMappings) {
        const mappings = siteConfig.valueMappings[key];
        if (mappings) {
            value = mappings[value] || value;
        }
    }

    if (element.isReactSelect) {
        return fillReactSelect(element.containerId, value);
    } else if (isReactSelect(element)) {
        return fillReactSelect(element.id, value);
    } else if (element.tagName === 'SELECT') {
        const option = Array.from(element.options).find(option =>
            option.value.toLowerCase() === value.toLowerCase() ||
            option.textContent.toLowerCase() === value.toLowerCase()
        );
        if (option) {
            element.value = option.value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } else {
            return false;
        }
    } else if (element.type === 'radio') {
        return selectRadioButton(element.name, value);
    } else {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`Field ${key} filled with: ${value}`);
        return true;
    }
} 