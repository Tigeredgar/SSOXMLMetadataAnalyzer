import './App.css';
import React, { useState } from 'react';
import CopyToClipboard from './copyToClipboard';
import parseXML from './parseXML';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy Certificate to Clipboard');

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const xml = e.target.result;
      const { entityId, certificate, ssoUrl } = parseXML(xml);
      console.log('SSO URL:', ssoUrl); 
      setResult({ entityId, certificate, ssoUrl });
    };
    reader.readAsText(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  function downloadCert() {
    const element = document.createElement('a');
    const file = new Blob([`-----BEGIN CERTIFICATE-----\n${result.certificate}\n-----END CERTIFICATE-----`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'certificate.cert';
    document.body.appendChild(element);
    element.click();
  }

  function downloadTxt() {
    const element = document.createElement('a');
    const file = new Blob([`-----BEGIN CERTIFICATE-----\n${result.certificate}\n-----END CERTIFICATE-----`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'certificate.txt';
    document.body.appendChild(element);
    element.click();
  }

  function copyCertToClipboard() {
    const text = `-----BEGIN CERTIFICATE-----\n${result.certificate}\n-----END CERTIFICATE-----`;
    navigator.clipboard.writeText(text);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy Certificate to Clipboard'), 1000);
  }

  return (
    <div className="App">
      <h1>SAML XML Metadata Analyzer</h1>
      <div className="dropzone-container">
        <div
          className="dropzone"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          {file ? file.name : 'Drag and drop your XML file here or click "Choose File" below to select a file'}
        </div>
        <input
          type="file"
          accept=".xml"
          className="file-input"
          onChange={handleFileSelect}
        />
      </div>
      {result && (
        <div className="results">
          <p><b>EntityID:</b>   <span>{result.entityId || 'Not available'}</span>
          <CopyToClipboard textToCopy={result.entityId} /></p>
          <p><b>SSO URL: </b>  <span>{result.ssoUrl || 'Not available'}</span>
          <CopyToClipboard textToCopy={result.ssoUrl} /></p>
          <p><b>Certificate: </b> {result.certificate && (
      <>
        <button onClick={downloadCert}>Download in .cert format</button>
        <button onClick={downloadTxt}>Download in .txt format</button>
        <button onClick={copyCertToClipboard}>{copyButtonText}</button>
      </>
    )} </p>
        </div>
      )}
    </div>
  );
}

export default App;
