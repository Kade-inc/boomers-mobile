import { ColorsRevised } from '@/constants/ColorsRevised';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { useContext, useState, useRef, useCallback } from 'react';
import { icon } from '@/constants/icon';
import useGetAllTeams from '@/hooks/queries/useGetAllTeams';
import TeamCard from '@/components/ui/TeamCard';
import { useTabBar } from '@/context/TabBarContext';
import CustomButton from '@/components/ui/CustomButton';
import { useDebounce } from '@/hooks/useDebounce';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Custom RefreshControl component
const CustomRefreshControl = ({ refreshing, onRefresh, currentTheme }: { refreshing: boolean; onRefresh: () => void; currentTheme: string }) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={ColorsRevised.yellow}
      colors={[ColorsRevised.yellow]}
      progressBackgroundColor={currentTheme === 'dark' ? ColorsRevised.darkgrayBackground : ColorsRevised.white}
    />
  );
};

export default function TeamsScreen() {
    const { currentTheme } = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500);
    const { data: teamsData, isLoading, isError, fetchNextPage, refetch, isRefetching } = useGetAllTeams(1, debouncedSearchQuery);  

    // Flatten the pages data from infinite query
    const teams = teamsData?.pages?.flatMap((page) => page.data?.data || []) || [];
    
    const { isVisible, setIsVisible } = useTabBar();
    const scrollY = useRef(0);
    const isScrollingUp = useRef(false);

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

      // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    setIsVisible(!isVisible);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
    <BottomSheetModalProvider>
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
        <View style={styles.headerView}>
            <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, fontSize: 24, fontFamily: 'MontserratBold'}}>Teams</Text>
        </View>
        <View style={styles.searchContainer}>
            <View style={[
            styles.searchBar,
            { backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgrayBackground : ColorsRevised.white }
            ]}>
            {icon.search({ color: currentTheme === 'dark' ? ColorsRevised.white + '90' : ColorsRevised.black + '80' })}
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
            <View style={[styles.filterContainer]} >
              <TouchableOpacity onPress={handlePresentModalPress}>
                {icon.filter({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray })}
              </TouchableOpacity>
            </View>
      </View>
      {(isLoading)  && (
        <ActivityIndicator size="large" color={ColorsRevised.yellow} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} />
      ) } 
      {!isLoading && !isError && (
      <FlatList
        data={teams}
        renderItem={({item, index}) => <TeamCard team={item} cardStyles={{}} screen="all-teams" key={item._id} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ width: '90%', alignSelf: 'center', gap: 20, paddingBottom: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: 400,
            paddingVertical: 40
          }}>
            {icon.teams({ 
              color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray,
              size: 80,
            })}
            <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.darkgray, fontSize: 16, fontFamily: 'MontserratRegular', textAlign: 'center', marginTop: 24}}>
              {debouncedSearchQuery ? `No teams found for "${debouncedSearchQuery}"` : 'No teams found'}
            </Text>
          </View>
        )}
        refreshing={isRefetching}
        onRefresh={refetch}
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
    <BottomSheetModal
    ref={bottomSheetModalRef}
    onChange={handleSheetChanges}
    snapPoints={['25%', '50%', '75%']}
  >
    <BottomSheetView style={styles.contentContainer}>
      <Text>Awesome 🎉</Text>
    </BottomSheetView>
</BottomSheetModal>
</BottomSheetModalProvider>
</GestureHandlerRootView>
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
    paddingVertical: 5,
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
