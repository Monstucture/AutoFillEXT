export function isReactSelect(element) {
    return element.classList.contains('uit-react-select__input');
}

export function fillReactSelect(elementId, value) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.log(`Container for ${elementId} not found`);
        return false;
    }

    const input = container.querySelector("input[type='text']");
    if (!input) {
        console.log(`Input for ${elementId} not found`);
        return false;
    }

    // Set the value and dispatch events
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Simulate a click to open the dropdown
    input.click();

    // Find and click the matching option
    setTimeout(() => {
        const options = document.querySelectorAll('.uit-react-select__option');
        for (let option of options) {
            if (option.textContent.trim().toLowerCase() === value.toLowerCase()) {
                option.click();
                console.log(`Option ${value} selected for ${elementId}`);
                return true;
            }
        }
        console.log(`Option ${value} not found for ${elementId}`);
        return false;
    }, 100);  // Small delay to allow dropdown to open

    return true;
}

export function selectRadioButton(name, value) {
    const radioButtons = document.querySelectorAll(`input[name='${name}']`);
    for (let radio of radioButtons) {
        if (radio.value === value || radio.nextSibling.textContent.trim().toLowerCase() === value.toLowerCase()) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Radio button ${name} selected with value: ${value}`);
            return true;
        }
    }
    console.log(`No matching radio button found for ${name} with value: ${value}`);
    return false;
} 