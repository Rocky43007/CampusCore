import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '~/components/AppHeader';
import { COLORS } from '~/constants/colors';
import { CampusEvent } from '~/types';

import '../../global.css';

// =======================================
// Navigation Type
// =======================================
type EventsScreenProps = NativeStackScreenProps<RootStackParamList, 'Events'>;

const EventCard = React.memo(({ item }: { item: CampusEvent }) => {
  const imageUrl = item.imagePath
    ? `https://se-images.campuslabs.com/clink/images/${item.imagePath}`
    : undefined;

  const handlePress = useCallback(() => {
    Linking.openURL(`https://stonybrook.campuslabs.com/engage/event/${item.id}`).catch((err) =>
      console.error('Failed to open event link:', err)
    );
  }, [item.id]); // Dependency: item.id

  const formatEventDate = (startDate: string, endDate: string): string => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Date unavailable';
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const startStr = start.toLocaleString('en-US', options);
      if (start.toDateString() === end.toDateString()) {
        return `${startStr} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
      }
      return `${startStr} - ${end.toLocaleString('en-US', options)}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Date unavailable';
    }
  };

  return (
    <TouchableOpacity
      className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm"
      activeOpacity={0.7}
      onPress={handlePress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="h-48 w-full bg-gray-200" resizeMode="cover" />
      ) : (
        <View className="h-48 w-full items-center justify-center bg-gray-100">
          <Ionicons name="calendar-outline" size={40} color={COLORS.tertiary} />
        </View>
      )}
      <View className="p-4">
        <Text className="mb-1 text-lg font-semibold" style={{ color: COLORS.secondary }}>
          {item.name || 'Event Name Unavailable'}
        </Text>

        <View className="mb-2 flex-row items-center">
          <Ionicons name="time-outline" size={16} color={COLORS.tertiary} className="mr-1.5" />
          <Text className="text-sm text-gray-600">
            {formatEventDate(item.startsOn, item.endsOn)}
          </Text>
        </View>

        <View className="mb-2 flex-row items-center">
          <Ionicons name="location-outline" size={16} color={COLORS.tertiary} className="mr-1.5" />
          <Text className="flex-1 text-sm text-gray-600" numberOfLines={1}>
            {item.location?.isVirtual ? 'Virtual Event' : item.location?.name || 'Location TBD'}
          </Text>
        </View>

        {item.organization?.name && (
          <View className="mb-2 flex-row items-center">
            <Ionicons name="people-outline" size={16} color={COLORS.tertiary} className="mr-1.5" />
            <Text className="flex-1 text-sm text-gray-600" numberOfLines={1}>
              {item.organization.name}
            </Text>
          </View>
        )}

        {item.categories && item.categories.length > 0 && (
          <View className="mt-1 flex-row flex-wrap">
            {item.categories.slice(0, 3).map((category) => (
              <View
                key={category.id}
                className="mb-1 mr-1.5 rounded-full px-2 py-0.5"
                style={{ backgroundColor: `${COLORS.secondary}1A` }}>
                <Text className="text-xs font-medium" style={{ color: COLORS.secondary }}>
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

// =======================================
// Main Events Screen Component
// =======================================
export default function EventsScreen({ navigation }: EventsScreenProps): JSX.Element {
  const insets = useSafeAreaInsets();

  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    // Only set loading true initially, not for refresh
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);

    try {
      const now = new Date().toISOString();
      const response = await fetch(
        `https://stonybrook.campuslabs.com/engage/api/discovery/event/search?endsAfter=${now}&orderByField=startsOn&orderByDirection=ascending&status=Approved&take=50`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events (${response.status})`);
      }

      const data = await response.json();
      setEvents(data.value || []); // Set events on success
    } catch (err: any) {
      setError('Unable to load events. Please check connection and try again.');
      console.error('Error fetching events:', err.message || err);
      setEvents([]); // Clear events on error to avoid showing stale data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const keyExtractor = useCallback((item: CampusEvent) => item.id.toString(), []);

  // Use useCallback for stability, rendering the memoized EventCard
  const renderItem = useCallback(
    ({ item }: { item: CampusEvent }) => <EventCard item={item} />,
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="mx-4 mt-10 flex-1 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <Ionicons name="calendar-outline" size={48} color={COLORS.secondary} />
        <Text
          className="mt-3 text-center text-lg font-semibold"
          style={{ color: COLORS.secondary }}>
          No upcoming events found
        </Text>
        <Text className="mt-1 text-center text-sm text-gray-600">
          Check back later or pull down to refresh.
        </Text>
      </View>
    ),
    []
  );

  // --- Notification Press Handler ---
  const handleNotificationPress = (): void => {
    console.log('Notification icon pressed on Events Screen');
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      )}
      <SafeAreaView className="flex-1 bg-slate-50">
        {/* Status Bar */}
        {Platform.OS === 'android' && (
          <StatusBar barStyle="light-content" backgroundColor="#900000" animated />
        )}

        {/* Main Content */}
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? insets.top : 0,
            backgroundColor: 'white',
          }}>
          <AppHeader
            title="Campus"
            accentTitle="Events"
            onNotificationPress={handleNotificationPress}
            showBackButton
            navigation={navigation}
          />

          {/* Main Content ScrollView with consistent padding */}
          {loading && !refreshing ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text className="mt-3 text-gray-500">Loading events...</Text>
            </View>
          ) : error ? (
            <ScrollView // Use ScrollView here in case error message + button is long
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              refreshControl={
                // Allow refresh even on error screen
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary, COLORS.secondary]}
                />
              }>
              <View className="mx-4 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <Ionicons name="cloud-offline-outline" size={48} color={COLORS.primary} />
                <Text className="mt-3 text-center font-semibold text-red-700">Loading Failed</Text>
                <Text className="mt-1 text-center text-sm text-red-600">{error}</Text>
                <TouchableOpacity
                  className="mt-5 rounded-lg px-5 py-2"
                  style={{ backgroundColor: COLORS.primary }}
                  onPress={fetchEvents} // Use memoized fetchEvents
                  activeOpacity={0.7}>
                  <Text className="font-semibold text-white">Try Again</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            // Use FlatList for the event items
            <FlatList
              data={events}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={ListEmptyComponent}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 16 }} // pt-4 moved here
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary, COLORS.secondary]}
                />
              }
              // Performance Optimization Props
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={11}
              removeClippedSubviews={Platform.OS === 'android'}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
