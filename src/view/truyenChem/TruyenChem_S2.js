import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Appbar, PaperProvider } from "react-native-paper";

const TruyenChem_S2 = ({ navigation, route }) => {
  const { data } = route.params;

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: "#2A7BD3" }}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
      </Appbar.Header>

      <View style={{ flex: 1 }}>
        {/* name vn */}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginLeft: 12,
            marginTop: 15,
          }}
        >
          {data.nameVn}
        </Text>

        {/* name en */}
        <Text
          style={{
            fontStyle: "italic",
            fontSize: 18,
            marginLeft: 12,
            marginTop: 15,
          }}
        >
          {data.nameEN}
        </Text>

        {/* image */}
        <View
          style={{
            width: "100%",
            height: 220,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={data.image}
            style={{
              width: 350,
              height: 250,
              resizeMode: "contain",
              borderRadius: 40,
            }}
          />
        </View>

        {/* content */}
        <View
          style={{
            width: "93%",
            height: "100%",
            marginLeft: 14,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              textAlign: "justify",
            }}
          >
            {data.content}
          </Text>
        </View>
      </View>
    </PaperProvider>
  );
};

export default TruyenChem_S2;

const styles = StyleSheet.create({});
