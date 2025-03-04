import { getCurrentDomain } from '../utils/domUtils';
import { findElement, fillField } from '../utils/domUtils';
import { siteConfigurations } from '../config/siteConfig';

export function handleMessage(request, sender, sendResponse) {
    try {
        const site = request.site;
        const currentDomain = getCurrentDomain();
        let elementMappings = null;

        // Find matching site configuration
        for (const [domain, config] of Object.entries(siteConfigurations)) {
            if (currentDomain.includes(domain)) {
                elementMappings = config.elementMappings;
                break;
            }
        }

        if (!elementMappings) {
            sendResponse({ status: 'Error', message: 'No configuration for this site' });
            return true;
        }

        console.log('Received data:', request);

        let filledFields = 0;
        let notFoundElements = [];

        for (const [key, elementId] of Object.entries(elementMappings)) {
            const element = findElement(elementId);

            if (element && request[key] !== undefined) {
                console.log(`Processing ${key}: ${request[key]}`);
                if (fillField(element, request[key], site, key, siteConfigurations)) {
                    filledFields++;
                }
            } else if (!element) {
                console.log(`Element not found: ${elementId}`);
                notFoundElements.push(elementId);
            }
        }

        sendResponse({
            status: 'Success',
            message: `Filled ${filledFields} fields. ${notFoundElements.length} elements not found.`,
            notFoundElements: notFoundElements
        });
    } catch (error) {
        console.error('Error in content script:', error);
        sendResponse({ status: 'Error', message: error.message });
    }

    return true;
} 