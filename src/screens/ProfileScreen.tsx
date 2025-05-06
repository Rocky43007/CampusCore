import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { JSX, useState } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '~/components/AppHeader';
import DefaultModal from '~/components/DefaultModal';
import AppFooter from '~/components/Footer';
import { COLORS } from '~/constants/colors';

import '../../global.css';

// =======================================
// Navigation Type
// =======================================
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

// =======================================
// Main Profile Screen Component
// =======================================
export default function ProfileScreen({ navigation }: ProfileScreenProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  // --- Placeholder User Data --- (TODO: Replace with actual user data from API)
  const userProfile = {
    name: 'Wolfie the Seawolf',
    userId: '112345678',
    role: 'Student',
    // SBU Wolfie image
    imageUrl:
      'https://scontent-lga3-1.cdninstagram.com/v/t51.2885-19/356417586_2333872566800363_937917511512713269_n.jpg?_nc_ht=scontent-lga3-1.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2QG8DRmSvdVsYQi-wmaCGSm6JfVNJY7uLWRlb48jeFhjrDPt1stzGQm0EMaGSrNLb9k&_nc_ohc=gdxDJrh-QRMQ7kNvwFejcyf&_nc_gid=IppRmgXb1GhGCsX618vIoA&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfFzoBpwwIb3mtbJNbM5vMeJMI9sJyztJ0QckPAhSBGq4g&oe=68185401&_nc_sid=7d3ac5',
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View className="flex-1">
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            backgroundColor: '#900000',
          }}>
          {/* Header */}
          <AppHeader
            title="Campus"
            accentTitle="Profile"
            showBackButton
            navigation={navigation}
            style={{ backgroundColor: COLORS.primary }}
          />
          {/* Main Content */}
          {/* Use ScrollView to allow for scrolling on smaller screens */}
          <ScrollView contentContainerStyle={styles.scrollViewContent} className="bg-slate-50">
            {/* --- ID Card Visual Container --- */}
            <View
              style={styles.idCardContainer}
              className="mx-4 my-6 overflow-hidden rounded-xl bg-white shadow-lg">
              {/* ID Card Header Bar - SBU Red */}
              <View style={[styles.idHeader, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.idHeaderText}>STONY BROOK UNIVERSITY</Text>
              </View>

              {/* ID Card Content Area */}
              <View style={styles.idContent}>
                {/* Profile Picture */}
                <Image
                  source={{ uri: userProfile.imageUrl }}
                  style={styles.profileImage}
                  className="bg-gray-200"
                />

                {/* Text Details */}
                <View style={styles.textContainer}>
                  <Text style={styles.label}>NAME</Text>
                  <Text style={styles.nameText} numberOfLines={2} adjustsFontSizeToFit>
                    {userProfile.name}
                  </Text>

                  <Text style={[styles.label, styles.marginTop]}>SBU ID</Text>
                  <Text style={styles.idText}>{userProfile.userId}</Text>

                  <Text style={[styles.label, styles.marginTop]}>STATUS</Text>
                  <Text style={styles.roleText}>{userProfile.role}</Text>
                </View>
              </View>

              <View style={[styles.idFooter, { backgroundColor: COLORS.secondary }]} />
            </View>
            {/* --- End ID Card Visual Container --- */}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
              activeOpacity={0.8}
              onPress={() => setIsAlertVisible(true)}>
              <Ionicons name="id-card-outline" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.actionButtonText}>Use Digital ID Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, { borderColor: COLORS.primary }]}
              activeOpacity={0.7}
              onPress={() => setIsAlertVisible(true)}>
              <Text style={[styles.logoutButtonText, { color: COLORS.primary }]}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
          <DefaultModal
            isVisible={isAlertVisible}
            onClose={() => setIsAlertVisible(false)}
            title="Feature Unavailable">
            <View
              style={{
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: COLORS.light,
                  borderRadius: 50,
                  padding: 16,
                  marginBottom: 12,
                }}>
                <Ionicons name="warning-outline" size={32} color={COLORS.tertiary} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.dark,
                  marginBottom: 4,
                }}>
                This feature is not available yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.tertiary,
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                We're working hard to bring you this feature. Stay tuned for updates!
              </Text>
            </View>
          </DefaultModal>
        </View>
        <AppFooter />
      </View>
    </>
  );
}

// =======================================
// StyleSheet
// =======================================
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  idCardContainer: {
    width: '90%',
    maxWidth: 400,
  },
  idHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  idHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  idContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 100,
    height: 120, // Typical ID photo aspect ratio
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.light,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: COLORS.tertiary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  idText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  marginTop: {
    marginTop: 8,
  },
  idFooter: {
    height: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 16,
    width: '80%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    width: '80%',
    maxWidth: 350,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
