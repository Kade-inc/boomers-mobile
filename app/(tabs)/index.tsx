import { StyleSheet, View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { icon } from '@/constants/icon';

export default function HomeScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
        <ScrollView style={styles.scrollView}>
          <View style={[styles.display]}>
            <View style={styles.headerView}>
              <View>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 24, fontWeight: 'bold'}}>LOGO</Text>
              </View>
              <View style={styles.headerSubView}>
                {icon.bell({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black})}
                {icon.send({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black})}
              </View>
            </View>
            <View style={styles.headerBottomView}>
              <View style={styles.headerBottomSubView}>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Hi Paul,</Text>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 18, fontFamily: 'MontserratRegular'}}>Welcome to Boomers</Text>
              </View>
              <View style={styles.headerBottomAdviceView}>
                <TouchableOpacity 
                  style={styles.headerBottomAdviceView} 
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <LinearGradient
                    colors={['#D9436D', '#F26A4B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerBottomAdviceView}
                  >
                    {icon.zap({color: ColorsRevised.white})}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            activeOpacity={1} 
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View 
              style={[
                styles.modalContent, 
                { height: '50%' },
                { position: 'absolute', bottom: 0, left: 0, right: 0 }
              ]}
            >
              <View style={styles.modalHandle} />
              <View style={styles.modalBody}>
                {icon.smile({color: ColorsRevised.black, size: 60})}
                <Text style={styles.modalText}>You will always be rewarded for the work you do but not the work you show. Keep pushing forward and strive for greatness.</Text>
                <Text style={styles.modalSubText}>With ❤️ from Advice slip JSON API</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  display: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10
  },
  headerSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    width: '20%',
  },
  headerBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  headerBottomSubView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 5,
    paddingTop: 10
  },
  headerBottomAdviceView: {
    borderRadius: '100%',
    padding: 6,
    overflow: 'hidden'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#999',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
    fontFamily: 'MontserratMedium'
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: ColorsRevised.black,
    backgroundColor: '#F8B500',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50
  }
});
