import { ColorsRevised } from "@/constants/ColorsRevised";
import { icon } from "@/constants/icon";
import { ThemeContext } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap } from "react-native-tab-view";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }}>
    <Text>Testing</Text>
  </View>
);

const ThirdRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={FirstRoute} />
      <Tab.Screen name="Profile" component={SecondRoute} />
    </Tab.Navigator>
  );
}

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

const routes = [
  { key: "first", title: "Members" },
  { key: "second", title: "Challenges" },
  { key: "third", title: "Requests" },
];

export default function TeamDetailsScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            currentTheme === "dark" ? ColorsRevised.dark : ColorsRevised.gray,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/teams")}
          style={styles.backButton}
        >
          {icon.arrowLeft({
            color:
              currentTheme === "dark"
                ? ColorsRevised.white
                : ColorsRevised.black,
          })}
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.headerTitle,
              {
                color:
                  currentTheme === "dark"
                    ? ColorsRevised.white
                    : ColorsRevised.darkgray,
              },
            ]}
          >
            Team
          </Text>
        </View>
      </View>
      <ScrollView style={styles.subContainer}>
        <LinearGradient
          colors={["#313752", "#495D6D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.teamHeader]}
        >
          <View style={styles.leftHeader}>
            <Text style={styles.teamName}>Paul and the Funky Bunch</Text>
            <View style={styles.interestsContainer}>
              <Text style={styles.interestText}>Software Engineering</Text>
              <Text style={styles.interestText}>Full Stack</Text>
              <Text style={styles.interestText}>React Js</Text>
            </View>
          </View>
          <View style={styles.rightHeader}>
            {icon.userCircle({
              color: ColorsRevised.white,
              size: 50,
            })}
            <View style={styles.rightHeaderText}>
              <Text style={styles.rightHeaderName}>Paul Vitalis</Text>
              <Text style={styles.rightHeaderOwner}>Owner</Text>
            </View>
          </View>
        </LinearGradient>

        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          options={{
            first: {
              
            }
          }}
        /> */}
        <MyTabs />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 20,
    gap: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "MontserratSemiBold",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamHeader: {
    height: 200,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    gap: 20,
  },
  leftHeader: {
    width: "55%",
    gap: 20,
  },
  rightHeader: {
    width: "40%",
    alignItems: "center",
    gap: 16,
    paddingTop: 10,
  },
  teamName: {
    fontSize: 20,
    fontFamily: "MontserratBold",
    color: "white",
  },
  interestsContainer: {
    gap: 10,
  },
  interestText: {
    fontFamily: "MontserratMedium",
    color: "white",
  },
  rightHeaderText: {
    gap: 8,
    alignItems: "center",
  },
  rightHeaderName: {
    fontFamily: "MontserratSemiBold",
    color: "white",
    fontSize: 16,
  },
  rightHeaderOwner: {
    fontFamily: "MontserratMedium",
    color: "white",
    fontSize: 15,
  },
});
