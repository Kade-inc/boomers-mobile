import { ColorsRevised } from "@/constants/ColorsRevised";
import { icon } from "@/constants/icon";
import { ThemeContext } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ColorValue,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import useGetTeamDetails from "@/hooks/queries/useGetTeamDetails";
import TeamDetails from "@/entities/TeamDetails";
import { RouteProp, useRoute } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

type MembersRouteParams = {
  Members: {
    team: TeamDetails;
  };
};

const MembersRoute = () => {
  const { currentTheme } = useContext(ThemeContext);

  const route = useRoute<RouteProp<MembersRouteParams, "Members">>();
  const team = route.params.team;

  return (
    <FlatList
      data={team?.members.splice(1) || []}
      renderItem={({ item }) => (
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
          {item.profile_picture ? (
            <Image
              source={{ uri: item.profile_picture }}
              style={{ width: 90, height: 90, borderRadius: 60 }}
            />
          ) : (
            icon.userCircle({
              color:
                currentTheme === "dark"
                  ? ColorsRevised.white
                  : ColorsRevised.darkgray,
              size: 90,
            })
          )}
          {item?.firstName && item?.lastName ? (
            <Text
              style={{
                color:
                  currentTheme === "dark"
                    ? ColorsRevised.white
                    : ColorsRevised.darkgray,
                fontFamily: "MontserratSemiBold",
              }}
            >
              {item?.firstName + " " + item?.lastName}
            </Text>
          ) : (
            <Text
              style={{
                color:
                  currentTheme === "dark"
                    ? ColorsRevised.white
                    : ColorsRevised.darkgray,
                fontFamily: "MontserratSemiBold",
              }}
            >
              {item?.username}
            </Text>
          )}
        </View>
      )}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{
        alignSelf: "center",
        gap: 15,
        paddingBottom: 20,
        paddingTop: 15,
        backgroundColor:
          currentTheme == "dark" ? ColorsRevised.dark : ColorsRevised.gray,
        paddingHorizontal: 30,
        width: "100%",
        minHeight: "100%",
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
  team: TeamDetails | undefined;
}

function MyTabs({ currentTheme, team }: TabsProps) {
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
      <Tab.Screen
        name="Members"
        component={MembersRoute}
        initialParams={{ team }}
      />
      {/* <Tab.Screen name="Challenges" component={SecondRoute} />
      <Tab.Screen name="Requests" component={ThirdRoute} /> */}
    </Tab.Navigator>
  );
}

export default function TeamDetailsScreen() {
  const { currentTheme } = useContext(ThemeContext);

  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  const { data: team, isPending, error } = useGetTeamDetails(teamId!!);

  // Extract colors from the gradient string
  const colors = (team?.data?.teamColor
    ?.replace("linear-gradient(0deg, ", "")
    .replace(")", "")
    .split(", ")
    .map((color) => color.trim()) as [ColorValue, ColorValue]) || [
    "#000000",
    "#000000",
  ];

  const owner = team?.data?.members[0];
  const ownerName =
    owner?.firstName?.trim() && owner?.lastName?.trim()
      ? `${owner.firstName} ${owner.lastName}`
      : owner?.username;

  if (isPending) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              currentTheme === "dark" ? ColorsRevised.dark : ColorsRevised.gray,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#FFB500" />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.errorContainer,
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
        <Text
          style={[
            styles.errorText,
            {
              color:
                currentTheme === "dark"
                  ? ColorsRevised.white
                  : ColorsRevised.darkgray,
            },
          ]}
        >
          Failed to load team data.
        </Text>
      </SafeAreaView>
    );
  }
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
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.teamHeader]}
      >
        <View style={styles.leftHeader}>
          <Text style={styles.teamName}>{team?.data?.name}</Text>
          <View style={styles.interestsContainer}>
            <Text style={styles.interestText}>{team?.data?.domain}</Text>
            <Text style={styles.interestText}>{team?.data?.subdomain}</Text>
            {team?.data?.subdomainTopics.map((topic) => (
              <Text style={styles.interestText} key={topic}>
                {topic}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.rightHeader}>
          {owner?.profile_picture ? (
            <Image
              source={{ uri: owner.profile_picture }}
              style={{ width: 70, height: 70, borderRadius: 60 }}
            />
          ) : (
            icon.userCircle({
              color: ColorsRevised.white,
              size: 50,
            })
          )}
          <View style={styles.rightHeaderText}>
            <Text style={styles.rightHeaderName}>{ownerName}</Text>

            <Text style={styles.rightHeaderOwner}>Owner</Text>
          </View>
        </View>
      </LinearGradient>
      <MyTabs currentTheme={currentTheme} team={team?.data} />
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
    minHeight: 200,
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
  },
  errorText: {
    fontFamily: "MontserratMedium",
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
