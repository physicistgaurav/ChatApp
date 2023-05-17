import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { authentication, database, firebase } from "../config/firebase";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const height = Dimensions.get("window").height;

const email = authentication?.currentUser?.email;
// const userName = email?.split("@")[0];

const Home = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const userName = React.useMemo(
    () => authentication?.currentUser?.email?.split("@")[0] ?? "User",
    [authentication]
  );

  const [myData, setMyData] = useState([]);
  const fetchFirebaseDetails = firebase.firestore().collection("users");

  const handleFirebaseFetching = () => {
    setMyData([]);
    fetchFirebaseDetails.onSnapshot((query) => {
      let _tempData = [];
      query.forEach((doc) => {
        if (doc.data().email !== firebase.auth().currentUser?.email) {
          _tempData.push({ ...doc.data() });
        }
      });
      setMyData(_tempData);
    });
  };

  useEffect(() => {
    handleFirebaseFetching();
  }, []);

  const onSignOut = () => {
    signOut(authentication).catch((error) =>
      console.log("Error logging out: ", error)
    );
  };

  const filteredItems = myData.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => handleChatPress(item)}
    >
      <Icon name="user" size={30} color="blue" style={styles.icon} />
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleChatPress = (item) => {
    navigation.navigate("Chat", { targetEmail: item.email });
  };

  return (
    <>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <View>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            style={styles.inputBox}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity onPress={onSignOut}>
            <FontAwesome
              name="sign-out"
              size={30}
              color="grey"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.mainText}>Hey There {userName}</Text>
        <View style={{ padding: 15 }}>
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.uid}
          />
        </View>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={styles.chatButton}
        >
          <Entypo name="chat" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    paddingTop: height - 170,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  chatButton: {
    backgroundColor: "#2596be",
    height: 50,
    width: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fdd695",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eceff7",
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  searchIcon: {
    paddingRight: 15,
  },
  inputBox: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "black",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 20,
    color: "#2596be",
    marginLeft: 5,
  },
  mainText: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 20,
  },
});
