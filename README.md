# Dwell Spaces Hospitality

A buildless HTML/CSS/JavaScript website redesigned around the client's Havara reference, warm olive/rust/tan brand palette and supplied “The Art of Stay” copy.

## Deploy to Netlify
Import this repository and deploy `main`. Leave base directory and build command blank; publish directory is `dist` (configured in `netlify.toml`). No environment variables are needed for this frontend.

## Current functionality
- Spacious editorial homepage, four-residence collection, concierge copy, FAQs and contact.
- Client-supplied names: Olive Suites, Lychee Residence, Kiwi Residence and Cherry Suites; the latest client copy identifies a Yaba collection.
- Olive Suites is the only residence accepting enquiries. Lychee Residence, Kiwi Residence and Cherry Suites display “Currently not available”; their details direct visitors to Olive Suites. Direct enquiry hashes and stale drafts cannot select unavailable properties.
- Residence galleries remain viewable. Olive Suites enquiries carry its name into WhatsApp.
- Date and guest validation, night count, editable review and a prefilled WhatsApp message to +2348163899175. Visitors send the message themselves. No message is sent by the website automatically.
- Enquiry drafts persist in sessionStorage in the browser tab, with a memory-only fallback when storage is unavailable. Clear draft removes saved details.
- Responsive mobile menu, native accessible dialogs, keyboard focus handling, reduced motion, and hash navigation.

## Social accounts
Client-supplied links: Instagram https://www.instagram.com/dwellhospitality_/ and X https://x.com/dwellspaces. These are linked in Contact and the footer; tracking parameters were removed.

## Content and launch requirements
All interior photographs are labelled samples showing unrelated properties. Replace them with the actual residence photos before customer launch. Client-supplied names and marketing copy are included, but per-residence rates, capacities, bedrooms, addresses and amenity lists have not been confirmed. The earlier brief described an unnamed two-bedroom apartment at 16 Morroco Road, Yaba; it has not been arbitrarily assigned to one of the four new names. Confirm which property it describes.

The catalogue currently uses data in `dist/app.js`. It is **not an admin panel**. Authentication, database, image uploads, create/edit/archive listing management and multiple verified locations remain backend work. No payment processing, real-time availability or server-side enquiry inbox exists. The WhatsApp account itself has not been verified by sending a message.

Before launch also confirm property-specific fees, booking terms, check-in/out rules, cancellation policy, exact locations, service inclusions and privacy information. Typography uses system serif and sans-serif fonts, with no external font-loading dependency.

## Files
- `dist/index.html`: page sections and enquiry dialogs.
- `dist/style.css`: responsive earth-tone visual design.
- `dist/app.js`: catalogue, galleries, routing, validation, drafts and WhatsApp message preparation.
- `dist/assets/`: supplied logo and sample photography.

## Verification
JavaScript syntax checked. Browser checks include residence selection, rejection of checkout before check-in, a valid three-night/three-guest review, and matching WhatsApp link contents. Mobile menu, gallery navigation and draft restoration were also checked. Unavailable residence enquiry links are blocked and Olive Suites is the only selectable residence. No WhatsApp message or phone call is sent as part of testing.

## Photography
The sample lounge/bedroom images are by Basile Morin and the 1 Hotel Miami Beach image is by Clairecato321, via Wikimedia Commons, CC BY-SA 4.0. Source and licence links are in the site's Photography credits dialog. Images are cropped with CSS; original assets are retained. Dwell logo supplied by the client.
