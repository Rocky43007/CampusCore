import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import './global.css';

// Types for our events data
interface EventCategory {
  id: number;
  name: string;
}

interface EventOrganization {
  id: number;
  name: string;
  profilePicture?: string;
}

interface EventLocation {
  name: string;
  address?: string;
  isVirtual?: boolean;
  virtualLink?: string;
}

interface CampusEvent {
  id: number;
  name: string;
  description: string;
  startsOn: string;
  endsOn: string;
  imagePath?: string;
  location: EventLocation;
  categories: EventCategory[];
  organization: EventOrganization;
}

export default function EventsScreen(): JSX.Element {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const COLORS = {
    primary: '#990000', // StonyBrook Red
    secondary: '#003C71', // StonyBrook Blue
    tertiary: '#6D6E71', // StonyBrook Gray
    light: '#F2F2F2',
    dark: '#333333',
    accent: '#FFD100', // StonyBrook Gold
  };

  // Function to fetch events from the SB Engaged API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Current date in ISO format for filtering upcoming events
      const now = new Date().toISOString();

      // Using the API endpoint discovered in the HAR file
      const response = await fetch(
        `https://stonybrook.campuslabs.com/engage/api/discovery/event/search?endsAfter=${now}&orderByField=startsOn&orderByDirection=ascending&status=Approved&take=50`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.value || []);
    } catch (err) {
      setError('Unable to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  // Format date for display
  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };

    const startStr = start.toLocaleString('en-US', options);

    // If same day, just show time for end
    if (start.toDateString() === end.toDateString()) {
      return `${startStr} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    return `${startStr} - ${end.toLocaleString('en-US', options)}`;
  };

  // Render an individual event card
  const renderEventCard = (event: CampusEvent) => {
    return (
      <TouchableOpacity
        key={event.id}
        className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm"
        activeOpacity={0.7}
        onPress={() =>
          Linking.openURL(`https://stonybrook.campuslabs.com/engage/event/${event.id}`)
        }>
        {event.imagePath && (
          <Image
            source={{ uri: `https://se-images.campuslabs.com/clink/images/${event.imagePath}` }}
            className="h-48 w-full"
            resizeMode="cover"
          />
        )}
        <View className="p-4">
          <Text className="mb-1 text-lg font-bold" style={{ color: COLORS.secondary }}>
            {event.name}
          </Text>

          <View className="mb-3 flex-row items-center">
            <Ionicons name="time-outline" size={16} color={COLORS.tertiary} />
            <Text className="ml-1 text-sm text-gray-600">
              {formatEventDate(event.startsOn, event.endsOn)}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center">
            <Ionicons name="location-outline" size={16} color={COLORS.tertiary} />
            <Text className="ml-1 text-sm text-gray-600">
              {event.location.isVirtual ? 'Virtual Event' : event.location.name}
            </Text>
          </View>

          {event.organization && (
            <View className="mb-3 flex-row items-center">
              <Ionicons name="people-outline" size={16} color={COLORS.tertiary} />
              <Text className="ml-1 text-sm text-gray-600">{event.organization.name}</Text>
            </View>
          )}

          {event.categories && event.categories.length > 0 && (
            <View className="flex-row flex-wrap">
              {event.categories.slice(0, 3).map((category) => (
                <View
                  key={category.id}
                  className="mb-2 mr-2 rounded-full px-2 py-1"
                  style={{ backgroundColor: `${COLORS.secondary}15` }}>
                  <Text className="text-xs" style={{ color: COLORS.secondary }}>
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="shadow-lg" style={{ backgroundColor: COLORS.primary }}>
        <BlurView intensity={10} tint="dark" className="overflow-hidden">
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-white">Campus</Text>
              <Text className="text-2xl font-bold" style={{ color: COLORS.accent }}>
                Events
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              className="rounded-full bg-white/20 p-2"
              onPress={fetchEvents}>
              <Ionicons name="refresh-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text className="mb-4 text-xl font-bold" style={{ color: COLORS.secondary }}>
          Upcoming Events
        </Text>

        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="mt-4 text-gray-600">Loading events...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center rounded-xl bg-white p-6 shadow-sm">
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.tertiary} />
            <Text className="mt-4 text-center text-gray-600">{error}</Text>
            <TouchableOpacity
              className="mt-4 rounded-lg px-4 py-2"
              style={{ backgroundColor: COLORS.secondary }}
              onPress={fetchEvents}>
              <Text className="font-medium text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-xl bg-white p-6 shadow-sm">
            <Ionicons name="calendar-outline" size={48} color={COLORS.tertiary} />
            <Text
              className="mt-4 text-center text-lg font-medium"
              style={{ color: COLORS.secondary }}>
              No upcoming events
            </Text>
            <Text className="mt-2 text-center text-gray-600">
              Check back later for new campus events
            </Text>
          </View>
        ) : (
          <View>{events.map(renderEventCard)}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
