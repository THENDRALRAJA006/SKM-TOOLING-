/**
 * SKM Tooling Center — Centralized Official Contact Configuration
 * All contact details across the website should be imported from here.
 */

export const SITE_CONTACT = {
  companyName: 'SKM Tooling Center',
  tagline: 'Precision Tooling. Engineered for Performance.',
  primaryPhone: '+91 86674 74237',
  primaryPhoneTel: 'tel:+918667474237',
  secondaryPhone: '+91 95664 93554',
  secondaryPhoneTel: 'tel:+919566493554',
  whatsappNumber: '+91 86674 74237',
  whatsappUrl: 'https://wa.me/918667474237',
  email: 'skmtoolingcenter@gmail.com',
  emailMailto: 'mailto:skmtoolingcenter@gmail.com',
  address: {
    line1: 'No. 7/174-1B, Near Govt. Hr. School',
    line2: 'Rajeswari Layout, Begapalli (PO)',
    industrialArea: 'SIPCOT, Phase 3',
    city: 'Hosur',
    pincode: '635126',
    district: 'Krishnagiri',
    state: 'Tamil Nadu',
    country: 'India',
    fullFormatted:
      'No. 7/174-1B, Near Govt. Hr. School, Rajeswari Layout, Begapalli (PO), SIPCOT, Phase 3, Hosur – 635126, Krishnagiri, Tamil Nadu, India.',
  },
  operatingHours: 'Monday – Saturday: 8:30 AM – 6:30 PM (IST)',
  // Search query using the exact supplied address without inventing GPS coordinates
  mapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(
      'No. 7/174-1B, Near Govt. Hr. School, Rajeswari Layout, Begapalli, SIPCOT Phase 3, Hosur, Krishnagiri, Tamil Nadu 635126, India'
    ),
}
