# AutoFillEXT - Insurance Quote Autofill Extension

A Chrome extension for automatically filling insurance quote forms on supported websites.

## 🚀 Features

- **Multi-site Support**: Works with Allied, SageSure, ARI, and Cypress insurance platforms
- **Smart Form Filling**: Automatically fills form fields based on saved data
- **Data Persistence**: Save and load form data for quick reuse
- **Site-specific Configurations**: Different field mappings and default values for each site
- **Modern UI**: Clean, responsive interface with intuitive controls
- **Error Handling**: Comprehensive error handling and user feedback

## 📋 Supported Websites

- **Allied Trust Agents** (`alliedtrustagents.com`)
- **SageSure** (`agents.sagesure.com`)
- **American Risk Insurance** (`isi.americanriskins.com`)
- **Cypress** (`cypress.cogisi.com`)

## 🛠️ Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## 📖 Usage

### Basic Workflow

1. **Select Site**: Choose the insurance platform you're working with
2. **Fill Form**: Enter customer and property information
3. **Save Data**: Click "Save" to store the information for future use
4. **Navigate to Quote Page**: Go to the supported insurance website
5. **Autofill**: Click the extension icon and press "Autofill" to populate the form

### Form Fields

#### Personal Information
- First Name, Last Name
- Date of Birth
- Phone Number
- Email Address

#### Address Information
- Address Line 1 & 2
- City
- ZIP Code

#### Dwelling Information
- Dwelling Coverage (dA)
- Year Built
- Square Footage
- Number of Stories
- Roof Year
- Roof Shape & Material
- Construction Material
- Exterior Material
- Purchase Date

### Buttons

- **🚀 Autofill**: Fills the current page's form with saved data
- **🔄 Reset**: Clears user-entered fields (keeps site defaults)
- **💾 Save**: Stores current form data for later use
- **📂 Load**: Restores previously saved form data

## 🔧 Technical Details

### File Structure

```
AutoFillEXT/
├── manifest.json          # Extension configuration
├── index.html            # Popup interface
├── script.js             # Main popup logic (handles UI and data management)
├── content.js            # Content script (form filling and site configurations)
├── background.js         # Background script (communication bridge)
├── styles.css            # UI styling
└── README.md             # This file
```

### Architecture Overview

The extension follows a clean, minimal architecture:

1. **`script.js`** (Popup Logic):
   - Handles the extension popup UI
   - Manages form data collection and validation
   - Handles save/load operations using Chrome storage
   - Sends data to background script for form filling

2. **`background.js`** (Communication Bridge):
   - Handles communication between popup and content script
   - Routes messages to the active tab
   - Provides reliable message passing

3. **`content.js`** (Form Filling):
   - Runs on the target website
   - Contains all site configurations and element mappings
   - Receives data and fills form fields on the webpage

### Data Flow

```
User Input → script.js → background.js → content.js → DOM Elements
```

### Key Improvements Made

1. **Eliminated Redundancy**: Removed duplicate files and configurations
2. **Clean Architecture**: Simplified to essential files only
3. **Better Error Handling**: Comprehensive try-catch blocks and user feedback
4. **Async/Await**: Modern JavaScript patterns for better code readability
5. **Improved UI**: Modern, responsive design with better UX
6. **Single Source of Truth**: All configurations in one place

### Debugging

The extension includes comprehensive logging:

- **Console Logs**: Check browser console for detailed operation logs
- **Error Messages**: User-friendly error alerts with specific details
- **Success Feedback**: Confirmation messages for successful operations

### Troubleshooting

**Extension not working?**
1. Ensure you're on a supported website
2. Check that the page is fully loaded
3. Verify the extension is enabled
4. Check browser console for error messages

**Form fields not filling?**
1. Verify the element IDs match the site configuration in `content.js`
2. Check if the page structure has changed
3. Ensure JavaScript is enabled on the target site

**Data not saving/loading?**
1. Check Chrome storage permissions
2. Verify the extension has proper permissions
3. Try refreshing the extension

## 🔒 Permissions

The extension requires:
- **Storage**: To save and load form data
- **Active Tab**: To access the current webpage
- **Scripting**: To inject content scripts
- **Host Permissions**: To work on supported insurance websites

## 🚧 Development

### Adding New Sites

1. Add domain to `manifest.json` permissions
2. Add site configuration to `content.js`
3. Update element mappings for the new site
4. Test thoroughly on the target website

### Modifying Field Mappings

Edit the `elementMappings` object in `content.js` for each site:

```javascript
'domain.com': {
    elementMappings: {
        'field_name': 'element_id_or_selector',
        // ... more mappings
    }
}
```

### Understanding the Architecture

- **Popup (`script.js`)**: Handles user interface and data management
- **Background (`background.js`)**: Manages communication between components
- **Content (`content.js`)**: Executes on target websites and contains configurations

This architecture ensures:
- No code duplication
- Easy maintenance
- Clear separation of concerns
- Minimal file structure

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs for errors
3. Create an issue with detailed information

---

**Note**: This extension is designed for legitimate business use. Please ensure compliance with website terms of service and applicable laws. 