import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import React, { useState, useEffect, useCallback, JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Platform,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '~/components/AppHeader';
// import DevEventCounter from '~/components/DevEventCounter';
import { COLORS } from '~/constants/colors';
import { CampusEvent } from '~/types';
import '../../global.css';

// =======================================
//  Navigation Type
// =======================================
type EventsScreenProps = NativeStackScreenProps<RootStackParamList, 'Events'>;

// =======================================
// EventCard Component
// =======================================
const EventCard = React.memo(({ item }: { item: CampusEvent }) => {
  const imageUrl = item.imagePath
    ? `https://se-images.campuslabs.com/clink/images/${item.imagePath}`
    : undefined;

  const handlePress = useCallback(() => {
    Linking.openURL(`https://stonybrook.campuslabs.com/engage/event/${item.id}`).catch((err) =>
      console.error('Link Error', err)
    );
  }, [item.id]);

  const formatEventDate = useCallback((startDate: string, endDate: string): string => {
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
      console.error('Date formatting error:', e);
      return 'Date unavailable';
    }
  }, []);

  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={handlePress}>
      {/* Image Container */}
      <View style={styles.cardImageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Ionicons name="calendar-outline" size={40} color={COLORS.tertiary} />
          </View>
        )}
      </View>
      {/* Content Container */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name || 'Event Name Unavailable'}
        </Text>
        {/* Info Rows */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={15} color={COLORS.tertiary} style={styles.infoIcon} />
          <Text style={styles.infoText}>{formatEventDate(item.startsOn, item.endsOn)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={15}
            color={COLORS.tertiary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.location?.isVirtual ? 'Virtual Event' : item.location?.name || 'Location TBD'}
          </Text>
        </View>
        {item.organization?.name && (
          <View style={styles.infoRow}>
            <Ionicons
              name="people-outline"
              size={15}
              color={COLORS.tertiary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.organization.name}
            </Text>
          </View>
        )}
        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <View style={styles.categoryRow}>
            {item.categories.slice(0, 3).map((category) => (
              <View key={category.id} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category.name}</Text>
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
  // State
  const [fullEvents, setFullEvents] = useState<CampusEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CampusEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // For pagination loading

  // Constants
  const TAKE = 100; // Events per fetch

  // Fetching Logic (with pagination)
  const fetchEvents = useCallback(
    async (isRefreshing = false) => {
      if (!isRefreshing) setLoading(true);
      setIsLoadingMore(true);
      setError(null);
      if (isRefreshing) setSearchQuery(''); // Clear search only on manual refresh

      let allFetchedEvents: CampusEvent[] = isRefreshing ? [] : fullEvents; // Start from scratch on refresh
      let skip = isRefreshing ? 0 : allFetchedEvents.length; // Determine starting point
      let hasMore = true;

      try {
        while (hasMore) {
          const now = new Date().toISOString();
          const apiUrl = `https://stonybrook.campuslabs.com/engage/api/discovery/event/search?endsAfter=${now}&orderByField=startsOn&orderByDirection=ascending&status=Approved&take=${TAKE}&skip=${skip}`;
          const response = await fetch(apiUrl);

          if (!response.ok)
            throw new Error(`Fetch failed (skip=${skip}, status=${response.status})`);

          const data = await response.json();
          const newEvents = data.value || [];

          if (newEvents.length > 0) {
            const currentEventIds = new Set(allFetchedEvents.map((e) => e.id));
            const uniqueNewEvents = newEvents.filter(
              (event: CampusEvent) => !currentEventIds.has(event.id)
            );
            allFetchedEvents = allFetchedEvents.concat(uniqueNewEvents);
          }

          if (newEvents.length < TAKE) {
            hasMore = false;
          } else {
            skip += TAKE;
          }
        }
        setFullEvents(allFetchedEvents);
        // Apply current search filter immediately after fetching all data
        if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          const filtered = allFetchedEvents.filter(
            (event) =>
              event.name?.toLowerCase().includes(lowerCaseQuery) ||
              event.location?.name?.toLowerCase().includes(lowerCaseQuery) ||
              event.organization?.name?.toLowerCase().includes(lowerCaseQuery) ||
              event.categories?.some((cat) => cat.name?.toLowerCase().includes(lowerCaseQuery))
          );
          setFilteredEvents(filtered);
        } else {
          setFilteredEvents(allFetchedEvents);
        }
      } catch (err: any) {
        setError(`Unable to load events. ${err.message || 'Check connection.'}`);
        console.error('Fetch error:', err);
        if (isRefreshing) {
          setFullEvents([]);
          setFilteredEvents([]);
        } // Clear only if refresh fails completely
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
        setRefreshing(false);
      }
    },
    [searchQuery, fullEvents]
  ); // Include searchQuery and fullEvents if logic depends on them for pagination start

  useEffect(() => {
    fetchEvents(false); // Initial fetch
  }, []); // Run only once on mount

  // Filtering Logic - Separated from fetching, uses useMemo for efficiency
  const debouncedFilter = useCallback((query: string, eventsList: CampusEvent[]) => {
    if (!query) return eventsList;
    const lowerCaseQuery = query.toLowerCase();
    return eventsList.filter(
      (event) =>
        event.name?.toLowerCase().includes(lowerCaseQuery) ||
        event.location?.name?.toLowerCase().includes(lowerCaseQuery) ||
        event.organization?.name?.toLowerCase().includes(lowerCaseQuery) ||
        event.categories?.some((cat) => cat.name?.toLowerCase().includes(lowerCaseQuery))
    );
  }, []);

  useEffect(() => {
    // Debounce the state update for filteredEvents
    const timerId = setTimeout(() => {
      setFilteredEvents(debouncedFilter(searchQuery, fullEvents));
    }, 200); // Adjust debounce time as needed

    return () => clearTimeout(timerId);
  }, [searchQuery, fullEvents, debouncedFilter]);

  // Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents(true); // Trigger a full refresh
  }, [fetchEvents]);

  // --- Memoized FlatList Props ---
  const keyExtractor = useCallback((item: CampusEvent) => item.id.toString(), []);
  const renderItem = useCallback(
    ({ item }: { item: CampusEvent }) => <EventCard item={item} />,
    []
  );

  // --- Dynamic Empty List Component ---
  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name={searchQuery ? 'search-outline' : 'calendar-outline'}
          size={50}
          color={COLORS.tertiary}
        />
        <Text style={styles.emptyTitle}>
          {searchQuery ? `No results for "${searchQuery}"` : 'No upcoming events'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? 'Try a different search term.'
            : 'Check back later or pull down to refresh.'}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  // --- Footer Loading Indicator ---
  const ListFooterComponent = useCallback(
    () =>
      isLoadingMore && !loading ? (
        <View style={styles.footerLoadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.footerLoadingText}>Loading more...</Text>
        </View>
      ) : null,
    [isLoadingMore, loading]
  );

  // --- Main Render ---
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-slate-50">
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? insets.top : 0,
            backgroundColor: '#900000',
          }}>
          <AppHeader
            title="Campus"
            accentTitle="Events"
            showBackButton
            navigation={navigation}
            style={{ backgroundColor: COLORS.primary }}
          />

          {/* Search Bar Container */}
          <View style={styles.searchOuterContainer} className="bg-slate-50">
            <View style={styles.searchInnerContainer}>
              <Ionicons
                name="search-outline"
                size={22}
                color={COLORS.tertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor={COLORS.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery} // Directly sets state, useEffect handles filtering
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={22} color={COLORS.tertiary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Main Content Area */}
          {loading ? (
            <View style={styles.loadingContainer} className="bg-slate-50">
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading Events...</Text>
            </View>
          ) : error ? (
            <ScrollView // Use ScrollView for error state to allow refresh
              contentContainerStyle={styles.errorContainer}
              className="bg-slate-50"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }>
              <View style={styles.errorContent}>
                <Ionicons name="cloud-offline-outline" size={50} color={COLORS.primary} />
                <Text style={styles.errorTitle}>Loading Failed</Text>
                <Text style={styles.errorSubtitle}>{error}</Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: COLORS.primary }]}
                  onPress={() => fetchEvents(true)}
                  activeOpacity={0.7}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <FlatList
              className="bg-slate-50"
              data={filteredEvents}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={ListFooterComponent}
              contentContainerStyle={styles.listContentContainer}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
              initialNumToRender={8}
              maxToRenderPerBatch={5}
              windowSize={11}
              removeClippedSubviews={Platform.OS === 'android'}
              style={styles.listStyle}
            />
          )}
        </View>
        {/* {!loading && (
          <DevEventCounter filteredCount={filteredEvents.length} totalCount={fullEvents.length} />
        )} */}
      </View>
    </>
  );
}

// =======================================
// StyleSheet (Refined Styles)
// =======================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' /* bg-slate-100 */ },
  // Search Bar
  searchOuterContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB', // Match screen background
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  searchInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // bg-white
    borderRadius: 10, // Slightly more rounded
    paddingHorizontal: 12,
    height: 44, // Consistent height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, // Subtle shadow
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16, // Slightly larger text
    color: COLORS.dark,
    paddingVertical: 0, // Remove default padding if any
  },
  clearButton: { paddingLeft: 8 },
  // List
  listStyle: { flex: 1 },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16, // Space below search bar
    paddingBottom: 30,
  },
  // Card
  cardContainer: {
    backgroundColor: '#FFFFFF', // bg-white
    borderRadius: 12, // rounded-xl
    marginBottom: 16, // mb-4
    shadowColor: '#4B5563', // gray-600 shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', // Ensure image corners are clipped
  },
  cardImageContainer: {},
  cardImage: { height: 180, width: '100%' }, // h-45 approx
  cardImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6' /* bg-gray-100 */,
  },
  cardContent: { padding: 16 }, // p-4
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    /* semibold */ color: COLORS.secondary,
    marginBottom: 6,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  infoIcon: { marginRight: 8 }, // Increase spacing
  infoText: { flex: 1, fontSize: 14, color: '#4B5563' /* text-gray-600 */ },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F3F4F6' /* border-gray-100 */,
  },
  categoryTag: {
    backgroundColor: '#E5E7EB',
    /* bg-gray-200 */ borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  categoryText: { fontSize: 11, color: '#4B5563', /* text-gray-600 */ fontWeight: '500' },
  // States
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 15 },
  errorContainer: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  errorContent: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 30,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  errorTitle: { marginTop: 15, fontSize: 18, fontWeight: '600', color: COLORS.primary },
  errorSubtitle: { marginTop: 6, fontSize: 14, color: '#DC2626', textAlign: 'center' },
  retryButton: { marginTop: 25, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { fontWeight: '600', color: '#FFF', fontSize: 15 },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  emptySubtitle: { marginTop: 6, fontSize: 14, color: '#475569', textAlign: 'center' },
  footerLoadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLoadingText: { marginLeft: 10, color: COLORS.tertiary, fontSize: 14 },
});
