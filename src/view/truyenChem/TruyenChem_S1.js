import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { PaperProvider, Appbar } from "react-native-paper";
import ApiTruyenChem from "../../api/ApiTruyenChem";

const TruyenChem_S1 = ({ navigation }) => {
  const listTruyenChem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: "90%",
        height: 100,
        flexDirection: "row",
        backgroundColor: "#f3f3f3",
        marginTop: 12,
        marginLeft: 18,
        borderRadius: 12,
      }}
      onPress={() => navigation.navigate("TruyenChem_S2", { data: item })}
    >
      <View style={{ flex: 7, justifyContent: "center" }}>
        <Text style={{ fontSize: 17, paddingLeft: 13 }}>{item.nameVn}</Text>
      </View>
      <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={item.image}
          style={{
            width: 95,
            height: 95,
            resizeMode: "contain",
            borderRadius: 20,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: "#2A7BD3" }}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Truyện Chêm" color="white" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 9 }}>
          <FlatList
            keyExtractor={(item) => item.id}
            horizontal={false}
            renderItem={listTruyenChem}
            data={ApiTruyenChem}
          />
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </PaperProvider>
  );
};

export default TruyenChem_S1;

const styles = StyleSheet.create({});
