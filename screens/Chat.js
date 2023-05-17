import React, { useState, useLayoutEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  and,
  or,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { authentication, database, firebase } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function Chat({ route }) {
  const { targetEmail } = route.params;

  username = targetEmail.split("@")[0];

  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(authentication).catch((error) =>
      console.log("Error logging out: ", error)
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 10,
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color={colors.gray} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{username}</Text>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    // const doQuery = query(collectionRef, orderBy("createdAt", "desc"));

    const dbQuery = query(
      collection(database, "chats"),
      orderBy("createdAt", "desc"),
      where("email", "in", [targetEmail, authentication?.currentUser?.email]),
      where("targetEmail", "in", [
        targetEmail,
        authentication?.currentUser?.email,
      ])

      // where("email", "in", [targetEmail, firebase.auth().currentUser?.email])
      // where("targetEmail", "==", targetEmail)
      // where("targetEmail", "==", "targetEmail")

      // where("targetEmail", "==", targetEmail)
      // where("email", "==", firebase.auth().currentUser?.email)

      // or(
      //   where("targetEmail", "==", targetEmail),
      //   where("email", "==", firebase.auth().currentUser?.email)
      // )
    );

    const unsubscribe = onSnapshot(dbQuery, (querySnapshot) => {
      let _messages = querySnapshot.docs.map((doc) => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));

      _messages = JSON.parse(JSON.stringify(_messages));
      console.log("total messsages ", _messages.length);
      GiftedChat.append([], _messages);

      setMessages(_messages);
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    // setMessages([...messages, ...messages]);
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      createdAt,
      text,
      user,
      email: user.email,
      targetEmail,
    });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <View>
        <Text>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={(messages) => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      textInputStyle={{
        backgroundColor: "#fff",
        borderRadius: 20,
      }}
      user={{
        _id: authentication?.currentUser?.email,
        email: authentication?.currentUser?.email,
        avatar:
          "https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png",
      }}
    />
  );
}
