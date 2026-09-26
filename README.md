# Payment Gateway Frontend

A React checkout UI for a payment gateway — supports UPI, Credit Card, Debit
Card, and Net Banking. Built with `react-router-dom` for routing and `axios`
for the API call to the backend.

## Tech stack

- React 19
- React Router DOM 7
- Axios
- Plain CSS (design tokens in `src/index.css`, component styles in
  `src/Payment.css`) — no UI framework
- Google Fonts: **Fraunces** (display/serif) + **Inter** (body/UI)

## Getting started

```bash
npm install
npm start
```

The app runs at `http://localhost:3000` and redirects to `/payment`.

### Backend

The form posts to:

```
POST http://localhost:8080/api/payments
```

Make sure your backend is running on port `8080` before submitting a
payment, otherwise you'll see a "Backend server is not running" message.

## Available scripts

| Command         | Description                          |
|-----------------|---------------------------------------|
| `npm start`     | Runs the app in development mode      |
| `npm run build` | Builds the app for production         |
| `npm test`      | Runs the test runner                  |

## Project structure

```
payment-app/
├── public/
│   └── index.html        # fonts, title, meta
└── src/
    ├── index.js           # app entry, router setup
    ├── index.css          # global design tokens (colors, type, resets)
    ├── App.js              # route definitions
    ├── App.css             # legacy CRA styles (unused, kept for reference)
    ├── Payment.js          # checkout page (form logic + UI)
    └── Payment.css         # checkout page styles
```

## Routes

| Path                    | Description                                  |
|--------------------------|-----------------------------------------------|
| `/`                       | Redirects to `/payment`                       |
| `/payment`                | Checkout form, no method preselected          |
| `/payment/:gateway`       | Checkout form with a method preselected (`upi`, `credit`, `debit`, `netbanking`) |
| `*`                       | Unknown routes redirect to `/payment`         |

## Payment form behavior

1. Enter an amount.
2. Choose a payment method (UPI / Credit Card / Debit Card / Net Banking).
3. Fill in the method-specific details:
   - **UPI** → UPI ID
   - **Credit / Debit Card** → card number + CVV
   - **Net Banking** → bank selection (SBI, HDFC, ICICI, AXIS)
4. Click **Pay** to submit. A success, warning, or error banner appears
   below the form with the response message and transaction ID (when
   returned by the backend).

This logic lives entirely in `src/Payment.js` and was not changed during
the UI redesign — only the markup and styling around it.

## Design notes

The checkout is a two-panel layout:

- **Left (brand panel)** — dark navy background with a live-updating amount
  in serif type, the selected payment method, and trust indicators
  (encryption / no stored card data).
- **Right (form panel)** — the actual form: amount field, payment-method
  cards, method-specific inputs, and the Pay button.

Design tokens (colors, fonts, radii, shadows) are defined as CSS custom
properties at the top of `src/index.css` so the palette can be adjusted in
one place.

## Notes

- No UI framework (Bootstrap/react-bootstrap) is used — all styling is
  custom CSS.
- Fonts are loaded via Google Fonts `<link>` tags in `public/index.html`.
- Reduced-motion is respected (`prefers-reduced-motion`) — animations are
  disabled for users who have that OS setting on.
