import { ColorsRevised } from '@/constants/ColorsRevised';
import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/src/context/ThemeContext';
import { useContext, useState } from 'react';
import { icon } from '@/constants/icon';

    export default function TeamsScreen() {
        const { currentTheme } = useContext(ThemeContext);

        const [searchQuery, setSearchQuery] = useState('');
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
