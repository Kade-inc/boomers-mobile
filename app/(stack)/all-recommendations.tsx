import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '@/constants/icon';
import { useAuth } from '@/src/context/AuthContext';
import useRecommendations from '@/src/hooks/queries/useRecommendations';
import { Team } from '@/src/services/api';
import TeamCard from '@/components/ui/TeamCard';
import { router, useRouter } from 'expo-router';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/ui/CustomButton';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20 * 2;
const ITEM_WIDTH = width - HORIZONTAL_PADDING;

export default function AllRecommendationsScreen() {
  const router = useRouter();
  const { currentTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: recommendationsData, isPending: isRecommendationsLoading, isError: isRecommendationsError } = useRecommendations();

  const filteredRecommendations = recommendationsData?.data?.data?.filter((team: Team) => {
    return searchQuery.trim() === '' ? true :
      team.name.toLowerCase().includes(searchQuery.toLowerCase());
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
            placeholder="Search recommendations..."
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

      <ScrollView style={styles.content}>
        {isRecommendationsLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black} />
          </View>
        ) : isRecommendationsError ? (
          <View style={styles.loaderContainer}>
            {icon.xCircle({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
            <Text style={{ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratMedium' }}>
              Error loading recommendations
            </Text>
          </View>
        ) : filteredRecommendations.length > 0 ? (
          <View style={styles.recommendationsGrid}>
            {filteredRecommendations.map((team: Team) => (
              <TeamCard
                key={team._id}
                team={team}
                cardStyles={{
                  width: ITEM_WIDTH,
                  marginBottom: 15
                }}
                screen='all-recommendations'
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={{ alignItems: 'center' }}>
              {icon.smile({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, size: 50 })}
            </View>
            <Text style={[styles.emptyStateText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
              No recommendations found
            </Text>
            <Text style={[styles.emptyStateSubText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
              Edit your profile with your interests to get recommendations
            </Text>
            <CustomButton title='Edit Profile' handlePress={() => console.log("Edit profile coming soon")} containerStyles={{width: '100%', backgroundColor: '#F8B500'}} textStyles={{fontSize: 14, color: ColorsRevised.black}}/>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recommendationsGrid: {
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
  emptyStateSubText: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    textAlign: 'center',
    opacity: 0.8,
  },
}); 