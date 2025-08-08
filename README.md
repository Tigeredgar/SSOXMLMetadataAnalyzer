## SSO XML Metadata Analyzer

Analyze SAML 2.0 XML metadata files entirely in the browser. This app quickly extracts the most commonly needed values when integrating Single Sign-On:

- EntityID
- IdP SingleSignOnService URL (for IdP metadata) or SP AssertionConsumerService URL (for SP metadata)
- X.509 certificate (first found)

Everything runs client-side. Your XML file never leaves your machine.

### Features
- **Drag & drop or file picker**: Load any `.xml` SAML metadata file.
- **Auto-detect IdP vs SP**: Reads `IDPSSODescriptor` or `SPSSODescriptor` and picks the corresponding endpoint:
  - IdP: first `SingleSignOnService@Location`
  - SP: first `AssertionConsumerService@Location`
- **Extract X.509 certificate**: Grabs the first `X509Certificate` value.
- **One-click copy**: Copy EntityID and URL from the UI; copy the certificate with header/footer.
- **Download certificate**: Save the certificate as `.cert` or `.txt`.
- **Client-side privacy**: Parsing happens in your browser using `xmldom`.

### Tech stack
- **UI**: React 18 + Vite
- **XML parsing**: `xmldom` DOMParser

### Getting started
Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal (typically `http://localhost:5173`).

For production builds:

```bash
npm run build
npm run preview
```

### Usage
1. Start the app and open it in your browser.
2. Drag and drop a SAML metadata `.xml` file into the drop zone (or click Choose File).
3. The app extracts and displays:
   - EntityID
   - SSO URL (IdP SSO endpoint or SP ACS endpoint)
   - Certificate actions (copy/download)
4. Use the copy buttons to copy values, or download the certificate.

### How it works
- `src/parseXML.jsx`
  - Uses `xmldom` `DOMParser` to parse the XML string.
  - Reads the root `entityID` attribute.
  - Extracts the first `X509Certificate` value.
  - If `IDPSSODescriptor` exists, returns the first `SingleSignOnService@Location` as the SSO URL.
  - Otherwise (SP metadata), returns the first `AssertionConsumerService@Location` as the SSO/ACS URL.

- `src/App.jsx`
  - Handles drag-and-drop and file selection.
  - Uses a `FileReader` to read XML text and calls `parseXML`.
  - Renders results and provides copy/download actions for the certificate.

- `src/copyToClipboard.jsx`
  - Simple reusable button to copy a provided string into the clipboard with quick visual feedback.

### Project structure (key files)
```
SSO-XML-Metadata-Analyzer/
  ├─ index.html
  ├─ src/
  │  ├─ App.jsx                 # UI, file handling, rendering results
  │  ├─ parseXML.jsx            # XML parsing logic (EntityID, SSO/ACS URL, X.509 cert)
  │  ├─ copyToClipboard.jsx     # Reusable copy button
  │  └─ index.jsx               # App bootstrap
  └─ public/
     └─ favicon.png
```

### Compatibility notes
- Designed for standard SAML 2.0 metadata. Namespaces are handled via wildcard lookups, so common IdP/SP exports generally work.
- The app selects the first matching endpoint and the first certificate it finds.

### Security & privacy
- Files are processed entirely in your browser; nothing is uploaded to a server.
- No validation is performed on certificates or endpoints; this is a convenience tool, not a security scanner.

### Limitations and potential enhancements
- Picks the first `SingleSignOnService` or `AssertionConsumerService` only; does not consider `isDefault` or `index` preferences.
- Reads only the first `X509Certificate` and does not distinguish signing vs encryption keys.
- Does not parse additional metadata like `SingleLogoutService`, NameID formats, or bindings.
- Future improvements could include multi-endpoint selection, better validation, and richer metadata coverage.