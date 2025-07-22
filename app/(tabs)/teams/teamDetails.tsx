import { ColorsRevised } from "@/constants/ColorsRevised";
import { icon } from "@/constants/icon";
import { ThemeContext } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap } from "react-native-tab-view";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

interface ItemInterface {
  item: {
    id: number;
    img: string;
    name: string;
  };
}

interface Item {
  id: number;
  img: string | null;
  name: string;
}
const members: Item[] = [
  {
    id: 0,
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Paul Dreamer",
  },
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1679217125041-6f81624038d4?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Jeames Gloen",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1515907467242-93cd67ebc7d6?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Thref chs",
  },
  {
    id: 3,
    img: null,
    name: "Chet Homegren",
  },
  {
    id: 4,
    img: null,
    name: "Linkin Park",
  },
  {
    id: 5,
    img: null,
    name: "Don Clgove",
  },
  {
    id: 6,
    img: null,
    name: "Perry white",
  },
  {
    id: 7,
    img: null,
    name: "Pete Ross",
  },
];

const MemberCard = ({ item }: ItemInterface) => {
  return (
    <View>
      <Image
        source={{ uri: item.img }}
        style={{ width: 200, height: 200, borderRadius: 60 }}
        resizeMode="cover"
      />
      <Text
        style={{
          color: ColorsRevised.darkgray,
          fontFamily: "MontserratSemiBold",
        }}
      >
        {item.name}
      </Text>
    </View>
  );
};
const FirstRoute = () => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <FlatList
      data={members}
      renderItem={({ item, index }) => (
        <View
          style={{
            width: 150,
            height: 150,
            backgroundColor: `${
              currentTheme === "dark"
                ? ColorsRevised.darkgray
                : ColorsRevised.white
            }`,
            shadowColor: "#000",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            gap: 10,
          }}
        >
          {item.img ? (
            <Image
              source={{ uri: item.img }}
              style={{ width: 100, height: 100, borderRadius: 60 }}
              resizeMode="cover"
            />
          ) : (
            icon.userCircle({
              color:
                currentTheme === "dark"
                  ? ColorsRevised.white
                  : ColorsRevised.darkgray,
              size: 100,
            })
          )}

          <Text
            style={{
              color:
                currentTheme === "dark"
                  ? ColorsRevised.white
                  : ColorsRevised.darkgray,
              fontFamily: "MontserratSemiBold",
            }}
          >
            {item.name}
          </Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        alignSelf: "center",
        gap: 15,
        paddingBottom: 20,
        paddingTop: 15,
        backgroundColor:
          currentTheme == "dark" ? ColorsRevised.dark : ColorsRevised.gray,
        paddingHorizontal: 30,
        width: "100%",
      }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        gap: 15,
      }}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      ListEmptyComponent={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            paddingVertical: 40,
          }}
        >
          {icon.teams({
            color:
              currentTheme === "dark"
                ? ColorsRevised.white
                : ColorsRevised.darkgray,
            size: 80,
          })}
          <Text
            style={{
              color:
                currentTheme === "dark"
                  ? ColorsRevised.white
                  : ColorsRevised.darkgray,
              fontSize: 16,
              fontFamily: "MontserratRegular",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            No Members
          </Text>
        </View>
      )}
    />
  );
};

const SecondRoute = () => (
  <ScrollView style={styles.subContainer}>
    <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
  </ScrollView>
);

const ThirdRoute = () => (
  <ScrollView style={styles.subContainer}>
    <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
  </ScrollView>
);

interface TabsProps {
  currentTheme: string;
}

function MyTabs({ currentTheme }: TabsProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: "MontserratSemiBold",
          color: `${
            currentTheme === "dark"
              ? ColorsRevised.white
              : ColorsRevised.darkgray
          }`,
        },
        tabBarStyle: {
          backgroundColor: `${
            currentTheme === "dark" ? ColorsRevised.dark : ColorsRevised.gray
          }`,
        },
        tabBarIndicatorStyle: { backgroundColor: "#F8B500" },
      }}
    >
      <Tab.Screen name="Members" component={FirstRoute} />
      <Tab.Screen name="Challenges" component={SecondRoute} />
      <Tab.Screen name="Requests" component={ThirdRoute} />
    </Tab.Navigator>
  );
}

export default function TeamDetailsScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const { teamId } = useLocalSearchParams<{ teamId: string }>();

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
      {/* <ScrollView style={styles.subContainer}> */}
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
      <MyTabs currentTheme={currentTheme} />
      {/* </ScrollView> */}
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
