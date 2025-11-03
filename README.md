# Satochip-React-Native-Demo

A simple react-native application that demonstrates Satochip integration using [satochip-react-native library](https://github.com/Toporin/satochip-react-native).

# setup project

Install node.js & npm (ubuntu)
```sh
sudo apt install nodejs npm
```

Install yarn
```sh
sudo npm install -g yarn
```

Check version
```sh
yarn --version
```

Install dependencies
```sh
yarn install
```

Add local Satochip-react-native library
```sh
yarn add file:../satochip-react-native
```

# build

Build APK manually (APK will be in android/app/build/outputs/apk/release/)
```sh
cd android
./gradlew clean
./gradlew assembleRelease
```

(option) Remove node_modules to start fresh
```sh
rm -rf node_modules
```

Reinstall modules
```sh
yarn install --force
```

Restart Metro
```sh
npx react-native start --reset-cache
```

Run on connected device/emulator
```sh
npx react-native run-android
```

# Complete Clean Reinstall

```sh
cd your/project/folder
```

Clean everything
```sh
rm -rf node_modules
rm yarn.lock
# or: rm package-lock.json
```

Reinstall all dependencies
```sh
yarn install
# or: npm install
```

Clear Android build cache
```sh
cd android
./gradlew clean
cd ..
```

Start fresh
```sh
npx react-native run-android
```