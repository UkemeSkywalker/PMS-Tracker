# Moniepoint PMS Tracker

A cross-platform React Native + Expo demo for finding and reporting PMS prices around Lagos. It targets iOS 16.7 and newer, and Android. The app uses the supplied UI references and station photography in `Assets/`.

## Run on an iPhone

1. Install [Expo Go](https://expo.dev/go) from the iOS App Store and sign in to an Expo account.
2. Run `npm install`, `npx expo login --browser`, and `npm start` in this repository. Sign in with the same Expo account.
3. Scan the QR code with the iPhone Camera. The phone and Mac should be on the same Wi-Fi.

The project uses Expo SDK 57, which supports iOS 16.4 and newer and matches the current App Store version of Expo Go. To run an iOS Simulator window on the Mac, install a compatible Xcode version and its Simulator runtime, then run `npm run ios`. For on-screen viewing without Xcode, an iPhone running iOS 18 or later can use Apple's iPhone Mirroring, or a USB-connected iPhone can be shown with QuickTime Player's movie recording device selector.

## Development

Run `npm run typecheck` to check TypeScript. Station prices, availability, queue conditions, reports, and rewards are demo data. Reports and saved stations persist on the device. Map tiles come from Apple Maps on iOS and Google Maps on Android through `react-native-maps`; the generated station images are used for cards and details. Location permission is optional, with a Victoria Island fallback.

The `Assets/` directory contains the original screens, HTML references, imagery, and design notes. Product screens use those references without treating the supplied illustrated Lagos map as a live map.
