# Dwell Spaces Hospitality

A responsive shortlet website prototype using HTML, CSS, and vanilla JavaScript. The interface follows the supplied mobile booking reference with a pink/lilac palette, property photos, a detail view, and bottom navigation.

## Deploy to Netlify

Import this GitHub repository into Netlify and deploy the `main` branch.

| Setting | Value |
| --- | --- |
| Base directory | Leave blank |
| Build command | Leave blank; no build step is needed |
| Publish directory | `dist` |

`netlify.toml` supplies the publish directory. No environment variables, framework install, or backend services are required for this prototype. Screen navigation uses URL hashes, so it does not need SPA rewrite rules.

## Current functionality

- Explore the supplied two-bedroom Yaba apartment, its photo gallery, all 14 amenities, and location.
- Four navigation destinations: Explore, Saved, My enquiry, and Contact.
- A three-step enquiry planner: preferred dates and guests, name and special requests, then review.
- Date validation and night-count calculation.
- Draft enquiry and saved apartment retained in `sessionStorage` for the browser tab, with a memory-only fallback if storage is unavailable.
- Resume/edit enquiry, clear a draft, and undo clearing during the same page session.
- A WhatsApp link carrying the selected apartment and enquiry details. The visitor sends the message themselves. The website does not claim delivery or booking confirmation.
- Phone and map links, responsive layouts, keyboard-accessible controls, reduced-motion support, and browser Back/Forward navigation between screens.

## Business content supplied

- Brand: Dwell Spaces Hospitality; tagline: Experience driven.
- Apartment: two bedrooms at 16 Morroco Road, Yaba, Lagos. Address spelling is retained from the brief.
- Reservations phone: 08163899175 / +2348163899175. WhatsApp account availability is not yet verified.
- Amenities are based on the client-supplied brief.

## Project status

This commit captures the current frontend prototype. The business has subsequently requested multiple properties in different locations, with an admin panel for listings and photo uploads. **The multi-property catalogue, admin authentication, database, photo upload storage, and listing management are not implemented yet.**

There is no server-side enquiry inbox, live availability calendar, payment processing, or instant booking. Enquiries continue through WhatsApp, with availability, rates, capacity, and terms confirmed directly by Dwell.

## Before customer launch

Replace sample photos with real property photos; confirm address/map pin, contact routing, rates and fees, guest capacity, availability process, check-in/out rules, deposits, cancellation terms, service inclusions, and privacy information. Build and secure the planned multi-property administration features before promising self-service listing management.

## Files

- `dist/index.html`: screens, property details, enquiry planner, and photo credits.
- `dist/style.css`: base reference-inspired styling.
- `dist/journey.css`: refined navigation, planner, draft summary, and typography.
- `dist/icons.js`: inline SVG icon definitions.
- `dist/app.js`: navigation, galleries, saved state, form validation, and WhatsApp enquiry generation.
- `dist/assets/`: logo and illustrative interior photos.

## Validation

The latest enquiry flow was checked in the browser: invalid checkout dates rejected; valid dates, guest count, and notes reflected correctly in review; draft and saved apartment survive refresh; clear/restore works; browser Back returns from property details to Saved. JavaScript syntax checks pass. No WhatsApp messages or phone calls were sent during checks. This is not a production backend or security audit.

## Image attribution

The interior images depict unrelated hospitality interiors and are visibly labelled as samples. Photos by Basile Morin (Amantaka lounge and bedroom) and Clairecato321 (1 Hotel Miami Beach lobby), Wikimedia Commons, CC BY-SA 4.0. Source and licence links are included in the Contact screen's photography credits. CSS crops images for display; original files are retained. The logo was supplied by the client; its inclusion does not grant additional rights to third parties.
