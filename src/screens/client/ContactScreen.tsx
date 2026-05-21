import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CampanaBackground from '../../components/CampanaBackground';
import { CustomButton, CustomInput, useToast } from '../../components';
import { getMe } from '../../services/profileApi';
import { submitContact } from '../../services/contactApi';
import { useAuth } from '../../hooks/useAuth';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { displayNameFromUser } from '../../utils/format';

const ContactScreen = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const isLoggedIn = isAuthenticated;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }
    try {
      const user = await getMe();
      const display = displayNameFromUser(user);
      if (display && !prefilled) {
        setName(display);
      }
      if (user.email && !prefilled) {
        setEmail(user.email);
      }
      setPrefilled(true);
    } catch {
      // User can still fill manually
    }
  }, [isLoggedIn, prefilled]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const successMessage = await submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      showToast(successMessage, 'success');
      if (!isLoggedIn) {
        setName('');
        setEmail('');
      }
      setSubject('');
      setMessage('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to send';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CampanaBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={clientStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.maxWidthCenter}>
          <View style={clientStyles.pageHeader}>
            <Text style={styles.title}>Start a project</Text>
            <Text style={styles.hint}>
              {isLoggedIn
                ? 'Name and email are pre-filled from your profile.'
                : 'Tell us what you need — we read every message.'}
            </Text>
          </View>

          <View style={clientStyles.section}>
            <Text style={clientStyles.sectionTitle}>Message</Text>
            <CustomInput label="Name" value={name} onChangeText={setName} placeholder="Your name" />
            <CustomInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
            <CustomInput label="Subject" value={subject} onChangeText={setSubject} placeholder="Subject" />
            <CustomInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Your message"
              multiline
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <CustomButton title="Send message" onPress={onSubmit} loading={loading} fullWidth />
          </View>
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  title: { ...theme.typography.titleLarge, marginBottom: theme.spacing.sm },
  hint: { ...theme.typography.bodyMuted },
  error: { color: theme.colors.error, marginBottom: theme.spacing.md, fontSize: 14 },
});

export default ContactScreen;
