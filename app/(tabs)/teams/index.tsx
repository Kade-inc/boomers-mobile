import { ColorsRevised } from '@/constants/ColorsRevised';
import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/src/context/ThemeContext';
import { useContext, useState, useRef } from 'react';
import { icon } from '@/constants/icon';
import useGetAllTeams from '@/src/hooks/queries/useGetAllTeams';
import TeamCard from '@/components/ui/TeamCard';
import { useTabBar } from '@/src/context/TabBarContext';
import CustomButton from '@/components/ui/CustomButton';

    export default function TeamsScreen() {
        const { currentTheme } = useContext(ThemeContext);
        const { data: teamsData, isLoading, isError, fetchNextPage, refetch, isRefetching } = useGetAllTeams(1);  

        // Flatten the pages data from infinite query
        const teams = teamsData?.pages?.flatMap((page) => page.data?.data || []) || [];
        
        const { setIsVisible } = useTabBar();
        const scrollY = useRef(0);
        const isScrollingUp = useRef(false);

        // console.log("TEAMS:",teams?.data);
        const [searchQuery, setSearchQuery] = useState('');

        const handleScroll = (event: any) => {
            const currentScrollY = event.nativeEvent.contentOffset.y;
            const previousScrollY = scrollY.current;
            
            // Always show tab bar when at the top
            if (currentScrollY <= 0) {
                setIsVisible(true);
                isScrollingUp.current = true;
                scrollY.current = currentScrollY;
                return;
            }
            
            // Determine scroll direction with a small threshold to prevent flickering
            const scrollThreshold = 5;
            const scrollDifference = currentScrollY - previousScrollY;
            
            if (scrollDifference > scrollThreshold) {
                // Scrolling down
                if (isScrollingUp.current) {
                    setIsVisible(false);
                    isScrollingUp.current = false;
                }
            } else if (scrollDifference < -scrollThreshold) {
                // Scrolling up
                if (!isScrollingUp.current) {
                    setIsVisible(true);
                    isScrollingUp.current = true;
                }
            }
            
            scrollY.current = currentScrollY;
        };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
        <View style={styles.headerView}>
            <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, fontSize: 24, fontFamily: 'MontserratBold'}}>Teams</Text>
        </View>
        <View style={styles.searchContainer}>
            <View style={[
            styles.searchBar,
            { backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgrayBackground : ColorsRevised.white }
            ]}>
            {icon.search({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black + '80' })}
            <TextInput
                style={[
                styles.searchInput,
                { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray }
                ]}
                placeholder="Search"
                placeholderTextColor={currentTheme === 'dark' ? ColorsRevised.white + '90' : ColorsRevised.black + '80'}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                {icon.close({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black + '80' })}
                </TouchableOpacity>
            )}
            </View>
            <View style={[styles.filterContainer]}>
                {icon.filter({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray })}
            </View>
      </View>
      {(isLoading || isRefetching)  && (
        <ActivityIndicator size="large" color={ColorsRevised.yellow} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} />
      ) } 
      {!isLoading && !isRefetching && !isError && (
      <FlatList
        data={teams}
        renderItem={({item, index}) => <TeamCard team={item} cardStyles={{}} screen="all-teams" key={item._id} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ width: '90%', alignSelf: 'center', gap: 20, paddingBottom: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {icon.teams({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray })}
            <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray, fontSize: 16, fontFamily: 'MontserratRegular', textAlign: 'center'}}>No teams found</Text>
          </View>
        )}
      />
      )}
      {(!isLoading || !isRefetching) && isError && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {icon.messages({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray })}
          <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray, fontSize: 16, fontFamily: 'MontserratRegular', textAlign: 'center'}}>Error fetching teams</Text>
          <CustomButton 
          title="Retry" 
          handlePress={() => refetch()} 
          containerStyles={{width: '70%'}} 
          textStyles={{fontSize: 16, fontFamily: 'MontserratMedium', color: ColorsRevised.darkgray}}
          isLoading={isRefetching}
          />
        </View>
      )}
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 10,
    width: '90%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
  },
  filterContainer: {

  },
});
