# Moniepoint PMS Tracker

A cross-platform React Native + Expo demo for finding and reporting PMS prices around Lagos. It targets iOS 16.7 and newer, and Android. The app uses the supplied UI references and station photography in `Assets/`.

## Run on an iPhone

1. Install [Expo Go](https://expo.dev/go) from the iOS App Store.
2. Run `npm install` and `npm start` in this repository.
3. Scan the QR code with the iPhone Camera. The phone and Mac should be on the same network. If discovery fails, use `npx expo start --tunnel`.

The project uses Expo SDK 54, which is compatible with the App Store version of Expo Go. To run an iOS Simulator window on the Mac, install Xcode and its Simulator runtime, then run `npm run ios`.

## Development

Run `npm run typecheck` to check TypeScript. Station prices, availability, queue conditions, reports, and rewards are demo data. Reports and saved stations persist on the device. Map tiles come from Apple Maps on iOS and Google Maps on Android through `react-native-maps`; the generated station images are used for cards and details. Location permission is optional, with a Victoria Island fallback.

The `Assets/` directory contains the original screens, HTML references, imagery, and design notes. Product screens use those references without treating the supplied illustrated Lagos map as a live map.
