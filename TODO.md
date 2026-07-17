# ShrimPredict SDK fix - TODO

- [ ] Update root `package.json` to set `expo-router` to `~6.0.0` (Expo SDK 54 compatibility).
- [ ] Run `npm install` at repo root.
- [ ] Run `npx expo install --fix` to align Expo/React Native packages to SDK 54 compatible versions.
- [ ] Run `npx expo-doctor` and capture full output.
- [ ] If `expo-doctor` reports:
  - [ ] missing `react-native-worklets` peer dependency, fix it.
  - [ ] duplicate babel plugin issue (`react-native-reanimated/plugin` vs `react-native-worklets/plugin`), fix `babel.config.js` accordingly.
- [ ] Confirm the Problems panel count after fixes.

