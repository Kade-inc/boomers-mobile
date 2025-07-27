import CustomButton from "@/components/ui/CustomButton";
import { images } from "@/constants";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
// Calculate the effective carousel item width based on SafeAreaView padding
const HORIZONTAL_PADDING = 20 * 2; // 20 on each side of the safe area
const ITEM_WIDTH = width - HORIZONTAL_PADDING;

export default function HomeScreen() {
  const dynamicContainerStyles = {
    marginTop: 20,
  };

  const dynamicTextStyles = {
    color: "#393E46",
    fontSize: 16,
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const carouselItems = [
    {
      id: 1,
      titleItems: ["Learn", "Grow", "Create"],
      body: "Connect with experienced Tech professionals",
    },
    {
      id: 2,
      titleItems: ["Create", "Recruit", "Challenge"],
      body: "Create your team and challenge other professionals with different challenges",
    },
    {
      id: 1,
      titleItems: ["Challenge", "Submit", "Repeat"],
      body: "Grow by challenging yourself",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselItems.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * ITEM_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 10000);

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
              onMomentumScrollEnd={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / ITEM_WIDTH);
                setCurrentIndex(index);
              }}
            >
              {carouselItems.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.carouselItem}>
                  <View style={styles.carouselTitle}>
                    {item.titleItems.map((title, titleIndex) => (
                      <View key={titleIndex} style={styles.flexRow}>
                        <Text style={styles.carouselText}>{title}</Text>
                        {titleIndex !== 2 && (
                          <View
                            style={[
                              styles.separatorDot,
                              styles.activeDot,
                              styles.dotMargin,
                            ]}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.carouselBody}>
                      {item.body}
                      <Text style={styles.dotSpecial}>.</Text>
                    </Text>
                  </View>
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
                    currentIndex === index
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          <CustomButton
            title="Get Started"
            handlePress={() => router.push("/signup")}
            containerStyles={dynamicContainerStyles}
            textStyles={dynamicTextStyles}
          />
        </SafeAreaView>
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover", // To Ensure the image scales properly
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "white",
    fontFamily: "MontserratExtraBold",
  },
  signIn: {
    color: "white",
    fontFamily: "MontserratBold",
    fontSize: 20,
  },
  carouselContainer: {
    // minHeight: 400,
    flex: 2,
  },
  carouselContent: {
    // This makes sure the items are centered vertically if needed
    // alignItems: 'center',
  },
  carouselItem: {
    width: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 10,
  },
  carouselText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "MontserratBold",
  },
  carouselBody: {
    fontSize: 23,
    color: "#fff",
    marginTop: 30,
    textAlign: "left",
    fontFamily: "MontserratExtraBold",
  },
  carouselTitle: {
    flexDirection: "row",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10, // Positioning the dot container within the carousel container
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#F8B500",
  },
  inactiveDot: {
    backgroundColor: "#fff",
  },
  separatorDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotSpecial: {
    color: "#F8B500",
    fontSize: 30,
  },
  dotMargin: {
    marginTop: 4,
  },
});
