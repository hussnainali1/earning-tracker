# Driver Earnings Tracker for iPhone

React Native + Expo SDK 57 + TypeScript, with Firebase Authentication and Firestore integration. A separate on-device mode works without Firebase configuration.

## Open on an iPhone

1. Install Expo Go from the App Store.
2. In this directory, run `npm install` and `npm start`.
3. Put the Mac and iPhone on the same Wi-Fi network.
4. Scan the terminal QR code using the iPhone Camera and open in Expo Go.
5. Choose Continue on this phone, or sign in once Firebase is configured.

The development server must stay running. A standalone install through TestFlight requires an Apple developer signing setup and a separate build.

## Share an iPhone test build

From this directory, install and sign in to EAS:

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform ios --profile preview
```

The preview build can be shared with registered test devices. For friends without registered devices, use TestFlight:

```bash
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios
```

TestFlight requires an Apple Developer Program account and an App Store Connect app. Firebase remains the backend for authentication and Firestore data. Do not commit `.env` or service-account keys.

## Features

Weekly earnings: five income categories, automatic driver/company split, edit, delete with confirmation, duplicate to next available week, monthly and yearly summaries, charts, settings, and optional sample records.

Qasa monthly records match the workbook fields: Month, Bolt, Uber, Uber Refund, Total Uber Cash, Uber Cash in hand, Uber Cash in Zettle, Total Zettle, Okeri (Swish + Card), Taxi Time, Expense, Total Qasa, and Driver share (default 47%). Notes and the applicable currency are saved too. Calculated fields update as inputs change; each month's percentage is preserved.

Qasa integrity rule: the current month's Qasa total must come from its weekly Qasa records. Users can add weekly Qasa entries during the month, and the app shows their running total. A manual full-month total cannot be entered until the month is complete. A finalized month must equal the sum of its weekly Qasa records, with duplicate and missing-week checks before finalization. Weekly Qasa and finalized monthly Qasa use separate records and cannot silently disagree.

The workbook has no year, so its historical rows have not been imported or assigned a guessed year.

## Workbook formulas

- Uber Cash in Zettle = Total Uber Cash - Uber Cash in hand - Expense
- Okeri (Swish + Card) = Total Zettle - Uber Cash in Zettle
- Total Qasa = Bolt + Uber + Uber Refund + Total Zettle + Taxi Time - Uber Cash in Zettle
- Driver share = Total Qasa × saved percentage / 100

Expense is treated exactly as the workbook specifies. Derived values can be negative. Taxi Time is a monetary payment, not hours. Weekly and Qasa monthly records are independent and are not added together.

## Firebase setup

1. Open your project in Firebase Console.
2. In Project settings, register a Web app (the Expo Firebase JavaScript SDK uses this configuration even on iPhone).
3. Copy `.env.example` to `.env` and enter the web configuration values.
4. Enable Authentication > Sign-in method > Email/Password.
5. Create a Cloud Firestore database if needed, then deploy `firestore.rules` using Firebase CLI or paste them into the console Rules editor. Preserve unrelated rules in an existing shared project.
6. Restart Expo with `npx expo start --clear`.

Never include service-account private keys in this project.

Storage paths:
- `users/{uid}/weekly_records/{YYYY-MM-DD}`
- `users/{uid}/qasa_months/{YYYY-MM}`
- `users/{uid}/settings/profile`

Money is stored in integer minor units (100 = 1 SEK). Qasa documents store named inputs plus validated derived values, a schema version, currency, notes and server update time. Ownership rules restrict access to the signed-in user; deterministic month IDs and transactions prevent duplicate creation. Local mode uses separate AsyncStorage keys and does not upload into cloud accounts automatically.

## Verification

`npm run typecheck`
`npm test`
`npx expo export --platform ios`

To publish the web/PWA build without installing command-line tools globally:

```bash
npx expo export --platform web
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

Firebase integration needs an enabled project and deployed rules before cloud acceptance testing. Physical iPhone interaction and cross-user rules need verification against the configured project or emulator. Cloud saves require a connection; a failed save leaves the form open. The prototype currently listens to all of the signed-in user's records; add pagination for large histories.
