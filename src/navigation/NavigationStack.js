import { Ionicons } from "@expo/vector-icons";
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addAuth, authSelector } from "../redux/reducers/authReducer";
import { RequestResetPassword, ResetPassword, SignIn, SignUp, Verification } from "../view/Authen";
import { SongNgu_S1, SongNgu_S2, SongNgu_S3 } from "../view/songNgu";
import { Account, Home, ListVocabulary } from "../view/TabScreen";
import { TinTuc_S1, TinTuc_S2 } from "../view/tinTuc";
import { TruyenChem_S1, TruyenChem_S2 } from "../view/truyenChem";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigationContainer = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ListVocabulary"
        component={ListVocabulary}
        options={{
          tabBarLabel: "Bộ từ",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="library-outline" size={size} color={color} />
            );
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: "Tài khoản",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person-outline" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};



const AuthenNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RequestResetPassword"
        component={RequestResetPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


const TruyenChemNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TruyenChem_S1"
        component={TruyenChem_S1}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TruyenChem_S2"
        component={TruyenChem_S2}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


const TinTucNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TinTuc_S1"
        component={TinTuc_S1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TinTuc_S2"
        component={TinTuc_S2}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};



const SongNguNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SongNgu_S1"
        component={SongNgu_S1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SongNgu_S2"
        component={SongNgu_S2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SongNgu_S3"
        component={SongNgu_S3}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


const MainNavigator = () => {
  return (

    <Stack.Navigator>


      <Stack.Screen
        name="TabNavigationContainer"
        component={TabNavigationContainer}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SongNguNavigation"
        component={SongNguNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TruyenChemNavigation"
        component={TruyenChemNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TinTucNavigation"
        component={TinTucNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator >

  )
}




const NavigationStack = () => {

  const { getItem } = useAsyncStorage('auth');

  const auth = useSelector(authSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin();

  }, [])

  const checkLogin = async () => {
    const res = await getItem();

    if (res) {
      dispatch(addAuth(JSON.parse(res)));
      console.log("res :", res);
    } else {
      // Xử lý trường hợp không tìm thấy thông tin đăng nhập

    }

  }


  return (
    <>
      {
        auth.accesstoken ? <MainNavigator /> : <AuthenNavigation />
      }
    </>
  );
};

export default NavigationStack;
