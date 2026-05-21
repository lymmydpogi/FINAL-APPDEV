const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Do not add `node_modules` to watchFolders — Metro already resolves it,
 * and watching the whole tree makes the first bundle and file watching very slow on Windows.
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), {});
