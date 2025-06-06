import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '@/constants/icon';
import { useAuth } from '@/src/context/AuthContext';
import useGetChallenges from '@/src/hooks/queries/useGetChallenges';
import { Challenge } from '@/src/services/api';
import ChallengeCard from '@/components/ui/ChallengeCard';
import { router, useRouter } from 'expo-router';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20 * 2;
const ITEM_WIDTH = width - HORIZONTAL_PADDING;

export default function AllChallengesScreen() {
  const router = useRouter();
  const { currentTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChallengeFilter, setSelectedChallengeFilter] = useState('All');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { data: challengesData, isPending: isChallengesLoading, isError: isChallengesError } = useGetChallenges(user?.user_id || '', true);

  useEffect(() => {
    if (challengesData?.data?.data) {
      const allChallenges = challengesData.data.data;
      const freshChallenges = allChallenges
        .filter((challenge) => {
          if (!challenge.due_date) return false;
          const dueDate = new Date(challenge.due_date);
          const now = new Date();
          return dueDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.due_date!);
          const dateB = new Date(b.due_date!);
          return dateA.getTime() - dateB.getTime();
        });
      setChallenges(freshChallenges);
    }
  }, [challengesData]);

  const filteredChallenges = challenges.filter((challenge: Challenge) => {
    // First apply the role filter
    const roleFiltered = selectedChallengeFilter === 'All' ? true :
      selectedChallengeFilter === 'Owner' ? challenge.owner_id === user?.user_id :
      challenge.owner_id !== user?.user_id;

    // Then apply the search filter
    const searchFiltered = searchQuery.trim() === '' ? true :
      challenge.challenge_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return roleFiltered && searchFiltered;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.gray }]}>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {icon.arrowLeft({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
          All Challenges
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[
          styles.searchBar,
          { backgroundColor: currentTheme === 'dark' ? ColorsRevised.black : ColorsRevised.white }
        ]}>
          {icon.search({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
          <TextInput
            style={[
              styles.searchInput,
              { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }
            ]}
            placeholder="Search challenges..."
            placeholderTextColor={currentTheme === 'dark' ? ColorsRevised.white + '80' : ColorsRevised.black + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              {icon.xCircle({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filters}>
        <Text style={{ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, fontFamily: 'MontserratMedium' }}>
          Filters
        </Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity onPress={() => setSelectedChallengeFilter('All')}>
            <Text style={[
              styles.filterButton,
              { color: selectedChallengeFilter === 'All' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black },
              { backgroundColor: selectedChallengeFilter === 'All' ? '#F8B500' : 'transparent' }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedChallengeFilter('Owner')}>
            <Text style={[
              styles.filterButton,
              { color: selectedChallengeFilter === 'Owner' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black },
              { backgroundColor: selectedChallengeFilter === 'Owner' ? '#F8B500' : 'transparent' }
            ]}>
              Owner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedChallengeFilter('Member')}>
            <Text style={[
              styles.filterButton,
              { color: selectedChallengeFilter === 'Member' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black },
              { backgroundColor: selectedChallengeFilter === 'Member' ? '#F8B500' : 'transparent' }
            ]}>
              Member
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isChallengesLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black} />
          </View>
        ) : isChallengesError ? (
          <View style={styles.loaderContainer}>
            {icon.xCircle({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
            <Text style={{ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratMedium' }}>
              Error loading challenges
            </Text>
          </View>
        ) : filteredChallenges.length > 0 ? (
          <View style={styles.challengesGrid}>
            {filteredChallenges.map((challenge: Challenge) => (
              <ChallengeCard
                key={challenge._id}
                challenge={challenge}
                cardStyles={{
                  width: ITEM_WIDTH,
                  marginBottom: 15
                }}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={{ alignItems: 'center' }}>
              {icon.smile({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, size: 50 })}
            </View>
            <Text style={[styles.emptyStateText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
              No challenges found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'MontserratSemiBold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
  },
  filters: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 2,
    fontFamily: 'MontserratMedium',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  challengesGrid: {
    gap: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    textAlign: 'center',
  },
});