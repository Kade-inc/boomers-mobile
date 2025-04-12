

import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
// Calculate the effective carousel item width based on SafeAreaView padding
const HORIZONTAL_PADDING = 20 * 2; // 20 on each side of the safe area
const ITEM_WIDTH = width - HORIZONTAL_PADDING;


export default function HomeScreen() {

  const dynamicContainerStyles = {
    marginTop: 20
  };

  const dynamicTextStyles = {
    color: '#393E46',
    fontSize: 16
  }

  const scrollViewRef = useRef<ScrollView>(null);
  const carouselItems = [1, 2, 3]; // You can replace these with your actual carousel data
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselItems.length;
        scrollViewRef.current?.scrollTo({ x: nextIndex * ITEM_WIDTH, animated: true });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={images.landing} style={styles.background}>
         {/* Black overlay with 40% opacity */}
         <View style={styles.overlay} />
          <SafeAreaView style={styles.safeArea}>

            <View style={styles.header}>
              <Text style={styles.logo}>LOGO</Text>
              <Text style={styles.signIn}>
                <Link href="/signin">Sign In</Link>
              </Text>
            </View>

           {/* Carousel */}
           <View style={styles.carouselContainer}>
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {/* Carousel Item 1 */}
              {/* <View style={[styles.carouselItem, { backgroundColor: 'rgba(255,0,0,0.5)' }]}>
                <Text style={styles.carouselText}>Carousel Item 1</Text>
              </View> */}
              {/* Carousel Item 2 */}
              {/* <View style={[styles.carouselItem, { backgroundColor: 'rgba(0,255,0,0.5)' }]}>
                <Text style={styles.carouselText}>Carousel Item 2</Text>
              </View> */}
              {/* Carousel Item 3 */}
              {/* <View style={[styles.carouselItem, { backgroundColor: 'rgba(0,0,255,0.5)' }]}>
                <Text style={styles.carouselText}>Carousel Item 3</Text>
              </View> */}

              {carouselItems.map((item, index) => (
                <View key={index} style={styles.carouselItem}>
                  <Text style={styles.carouselText}>Carousel Item {item}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {carouselItems.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
          
            <CustomButton 
            title="Get Started"
            handlePress={() => router.push('/signup')}
            containerStyles={dynamicContainerStyles}
            textStyles={dynamicTextStyles}/>
          </SafeAreaView>
      </ImageBackground>
      <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // To Ensure the image scales properly
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontFamily: 'MontserratExtraBold',
  },
  signIn: {
    color: 'white',
    fontFamily: 'MontserratBold',
    fontSize: 20
  },
  carouselContainer: {
    // minHeight: 400, // Adjust the height to fit your design
    flex: 2
  },
  carouselContent: {
    // This makes sure the items are centered vertically if needed
    alignItems: 'center',
  },
  carouselItem: {
    width: width - 40, // Adjust for horizontal padding (20 on each side)
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  carouselText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'MontserratSemiBold',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10, // Positioning the dot container within the carousel container
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#F8B500',
  },
  inactiveDot: {
    backgroundColor: '#fff',
  },
});
