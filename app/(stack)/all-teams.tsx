import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '@/constants/icon';
import { useAuth } from '@/src/context/AuthContext';
import useGetUserTeams from '@/src/hooks/queries/useGetUserTeams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TeamCard from '@/components/ui/TeamCard';
import { router, useRouter } from 'expo-router';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Team } from '@/src/entities/Team';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20 * 2;
const ITEM_WIDTH = width - HORIZONTAL_PADDING;

export default function AllTeamsScreen() {
  const router = useRouter();
  const { currentTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [userId, setUserId] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: userTeamsData, isPending: isTeamsLoading, isError: isTeamsError } = useGetUserTeams(user?.user_id || '');

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id || '');
    };
    getUserId();
  }, []);

  const filteredTeams = userTeamsData?.data?.data?.filter((team: Team) => {
    // First apply the role filter
    const roleFiltered = selectedTeamFilter === 'All' ? true :
      selectedTeamFilter === 'Owner' ? team.owner_id === user?.user_id :
      team.owner_id !== user?.user_id;

    // Then apply the search filter
    const searchFiltered = searchQuery.trim() === '' ? true :
      team.name.toLowerCase().includes(searchQuery.toLowerCase());

    return roleFiltered && searchFiltered;
  }) || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.gray }]}>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {icon.arrowLeft({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
          Dashboard
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
            placeholder="Search teams..."
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
          <TouchableOpacity onPress={() => setSelectedTeamFilter('All')}>
            <Text style={[
              styles.filterButton,
              { color: selectedTeamFilter === 'All' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black },
              { backgroundColor: selectedTeamFilter === 'All' ? '#F8B500' : 'transparent' }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTeamFilter('Owner')}>
            <Text style={[
              styles.filterButton,
              { color: selectedTeamFilter === 'Owner' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black },
              { backgroundColor: selectedTeamFilter === 'Owner' ? '#F8B500' : 'transparent' }
            ]}>
              Owner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTeamFilter('Member')}>
            <Text style={[
              styles.filterButton,
              { color: selectedTeamFilter === 'Member' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black },
              { backgroundColor: selectedTeamFilter === 'Member' ? '#F8B500' : 'transparent' }
            ]}>
              Member
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {isTeamsLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black} />
          </View>
        ) : isTeamsError ? (
          <View style={styles.loaderContainer}>
            {icon.xCircle({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
            <Text style={{ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratMedium' }}>
              Error loading teams
            </Text>
          </View>
        ) : filteredTeams.length > 0 ? (
          <View style={styles.teamsGrid}>
            {filteredTeams.map((team: Team) => (
              <TeamCard
                key={team._id}
                team={team}
                cardStyles={{
                  width: ITEM_WIDTH,
                  marginBottom: 15
                }}
                screen='all-teams'
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={{ alignItems: 'center' }}>
              {icon.smile({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, size: 50 })}
            </View>
            <Text style={[styles.emptyStateText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
              No teams found
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
  teamsGrid: {
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