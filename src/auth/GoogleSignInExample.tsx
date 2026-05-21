import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { authGoogleLogin } from '../app/actions';

/** Dev-only example — production uses Login → Continue with Google. */
export function GoogleSignInExample() {
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    setBusy(true);
    dispatch(authGoogleLogin());
    setBusy(false);
    Alert.alert('Dispatched', 'Check Redux auth slice after saga completes.');
  }, [dispatch]);

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.btn} onPress={onPress} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>Test Google (Firebase + Redux)</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16 },
  btn: { backgroundColor: '#38bdf8', padding: 12, borderRadius: 999, alignItems: 'center' },
  label: { color: '#fff', fontWeight: '600' },
});
