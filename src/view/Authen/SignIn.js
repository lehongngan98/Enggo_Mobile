
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Validate } from "../../ultis/Validate";
import authentication from "../../apis/authApi";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';



WebBrowser.maybeCompleteAuthSession();




const SignIn = ({ navigation }) => {
  // Switch
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false); //password co the nhin thay duoc mac dinh la false
  const [loading, setLoading] = useState(false);



  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };



  const api = '/google-signin';

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "951681961773-2p3d9vc8lunvv5sj82r6brl0qm3ft0oi.apps.googleusercontent.com",
    iosClientId: "951681961773-sd50gsefhsusrqj9foho4f7q91vlvkjp.apps.googleusercontent.com",
    androidClientId: "951681961773-2dg3su9is80rlp84uqmpesvpa4ks34js.apps.googleusercontent.com",

  });

  const [requestFacebook, responseFacebook, promptAsyncFacebook] = Facebook.useAuthRequest({
    clientId: '447429168323371',
  })



  useEffect(() => {
    handleLoginWithGoogle();
  }, [response]);

  useEffect(() => {
    handleLoginWithFacebook();
  }, [responseFacebook]);



  const handleLoginWithGoogle = () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("token :", token);

      getUserProfileSignInGoogle(token);

    }
  }



  const handleLoginWithFacebook = async () => {
    setLoading(true);

    if (responseFacebook?.type === 'success' && responseFacebook.authentication) {
      const token = responseFacebook.authentication.accessToken;
      console.log("Facebook token:", token);

      try {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
        );
        const userInfo = await userInfoResponse.json();
        const user = {
          email: userInfo.email || '', // Fallback if no email is provided
          fullname: userInfo.name,
          photo: userInfo.picture.data.url,
        };

        console.log("Facebook user info:", user);
        const res = await authentication.HandleAuthentication(api, user, "post");

        dispatch(addAuth(res.data));

        await AsyncStorage.setItem(
          'auth',
          JSON.stringify(res.data),
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error during Facebook login:", error);
      }
    }
    
  };


  const getUserProfileSignInGoogle = async (token) => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/userinfo/v2/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const userInfo = await response.json();
      const user = {
        email: userInfo.email,
        fullname: userInfo.name,
        photo: userInfo.picture,
      }

      console.log("user info : ", user);
      const res = await authentication.HandleAuthentication(api, user, "post");
      console.log("res data : ", res.data);

      dispatch(addAuth(res.data));

      await AsyncStorage.setItem(
        'auth',
        JSON.stringify(res.data),
      );

      // navigation.navigate('Home');
      console.log(res);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };



  // const getUserProfileSignInFacebook = async (token) => {
  //   if (!token) {
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);

  //     const userInfo = await response.json();
  //     const user = {
  //       email: userInfo.email ?? '',
  //       fullname: userInfo.name,
  //       photo: userInfo.picture.data.url,
  //     };

  //     console.log("Facebook user info:", user);
  //     const res = await authentication.HandleAuthentication(api, user, "post");
  //     console.log("Facebook res data:", res.data);

  //     dispatch(addAuth(res.data));

  //     await AsyncStorage.setItem(
  //       'auth',
  //       JSON.stringify(res.data),
  //     );

  //     console.log(res);
  //     setLoading(false);

  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //   }
  // };




  const handleLogin = async () => {
    const emailValidate = Validate.email(email);
    const passwordValidate = Validate.Password(password);

    if (!emailValidate) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }
    if (!passwordValidate) {
      Alert.alert("Lỗi", "Mật khẩu không hợp lệ");
      return;
    }

    // Call API login

    try {
      setLoading(true);
      const res = await authentication.HandleAuthentication("/login", { email, password }, "post")

      dispatch(addAuth(res.data));

      await AsyncStorage.setItem(
        'auth',
        // isRemember ? JSON.stringify(res.data) : email,
        JSON.stringify(res.data)

      );
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng");
      } else {
        Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
      console.error("Error during login:", error.message);
    } finally {
      setLoading(false);
    }

  }

  return (
    <View style={styles.container}>
      {/* logo */}
      <View
        style={{
          flex: 2.7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../img/imgAuth/logoSplashScreen.png")}
          style={{
            marginTop: 18,
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
        ></Image>
        <Text style={{ fontWeight: "bold", fontSize: 35, marginTop: 5 }}>
          Enggo
        </Text>
      </View>

      {/* Sign in form */}
      <View
        style={{
          flex: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ width: "85%", height: "100%", paddingTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 26 }}>Đăng nhập</Text>
          <View
            style={{
              width: "100%",
              height: 55,
              borderWidth: 1,
              borderRadius: 12,
              marginTop: 20,
              flexDirection: "row",
              borderColor: "gray",
            }}
          >
            <View
              style={{
                flex: 1.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="mail-outline" size={25} color="black" />
            </View>
            <View style={{ flex: 8.5, justifyContent: "center" }}>
              {/* Input Email */}
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                style={{
                  color: "gray",
                  fontSize: 18,
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: 55,
              borderWidth: 1,
              borderRadius: 12,
              marginTop: 18,
              flexDirection: "row",
              borderColor: "gray",
            }}
          >
            <View
              style={{
                flex: 1.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="lock-closed-outline" size={25} color="black" />
            </View>
            <View style={{ flex: 7, justifyContent: "center" }}>
              {/* Input Password */}
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholder="Nhập mật khẩu"
                style={{
                  color: "gray",
                  fontSize: 18,
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                flex: 1.5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={25}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              height: 45,
              marginTop: 15,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 6,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 3,
                }}
              >
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={{ width: 35, height: 25 }}
                />
              </View>
              <View style={{ flex: 7, marginTop: 5 }}>
                <Text style={{ fontSize: 16, marginLeft: -5 }}>
                  Nhớ tài khoản
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 4,
                // alignItems: "center",
                // justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("RequestResetPassword")}
              >
                <Text style={{ fontSize: 16, marginTop: 5 }}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* other login methods */}
      <View
        style={{
          flex: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "75%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              backgroundColor: "#5669fe",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 12,
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Đăng nhập</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "gray",
              fontWeight: "bold",
              fontSize: 18,
              marginTop: 35,
            }}
          >
            Hoặc
          </Text>
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 12,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "gray",
            }}
            onPress={() => promptAsync()}
          >
            <View
              style={{
                flex: 3,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../img/imgAuth/google.png")}
                style={{ width: 32, height: 32, resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 7 }}>
              <Text style={{ fontSize: 18 }}>Đăng nhập với Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 12,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "gray",
            }}
            onPress={() => promptAsyncFacebook()}
          >
            <View
              style={{
                flex: 3,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../img/imgAuth/fb.png")}
                style={{ width: 32, height: 32, resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 7 }}>
              <Text style={{ fontSize: 18 }}>Đăng nhập với Facebook</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, marginTop: 8 }}>
            Bạn chưa có tài khoản?
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ color: "#5669fe", fontSize: 16, marginLeft: 5 }}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );


};


export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
