import { DOMParser } from 'xmldom';

const parseXML = (xml) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');

  const entityId = xmlDoc.documentElement.getAttribute('entityID');
  const certificateTag = xmlDoc.getElementsByTagNameNS('*', 'X509Certificate')[0];
  const certificate = certificateTag?.textContent;

  let ssoUrl;

  // Check if the XML is an IDP
const idpTag = xmlDoc.getElementsByTagNameNS('*', 'IDPSSODescriptor')[0];
const spTag = xmlDoc.getElementsByTagNameNS('*', 'SPSSODescriptor')[0];
if (idpTag) {
  const ssoServiceTags = xmlDoc.getElementsByTagNameNS('*', 'SingleSignOnService');
  if (ssoServiceTags.length > 0) {
    ssoUrl = ssoServiceTags[0].getAttribute('Location');
  }
} else {
  const acsTag = xmlDoc.getElementsByTagNameNS('*', 'AssertionConsumerService')[0];
  if (acsTag) {
    ssoUrl = acsTag.getAttribute('Location');
  }
}
  return { entityId, certificate, ssoUrl };
};

export default parseXML;
