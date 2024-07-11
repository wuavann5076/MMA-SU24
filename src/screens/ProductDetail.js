import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import CurrencySplitter from "../assistants/currencySpliter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProductDetail = ({ route }) => {
  const { product } = route.params;
  const [isInCart, setIsInCart] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image?.[0] || null);
  const [currentSize, setCurrentSize] = useState(0);
  const navigate = useNavigation();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const token = await AsyncStorage.getItem("userToken");

      if (!email || !token) {
        Alert.alert("Please log in to view your cart.");
        return;
      }

      const userIdResponse = await axios.get(
        `http://10.0.2.2:8000/api/users/getUser/${email}`
      );
      const userId = userIdResponse.data.user._id;

      const cartResponse = await axios.get(
        `http://10.0.2.2:8000/api/carts/user/${userId}`
      );
      const cartItems = cartResponse.data;

      const isProductInCart = cartItems.some(
        (item) => item.productId === product._id
      );
      setIsInCart(isProductInCart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Alert.alert("Error", "Failed to fetch cart items. Please try again.");
    }
  };

  const handleAddToCart = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const token = await AsyncStorage.getItem("userToken");

      if (!email || !token) {
        Alert.alert("Please log in to add items to cart.");
        return;
      }

      const userIdResponse = await axios.get(
        `http://10.0.2.2:8000/api/users/getUser/${email}`
      );
      const userId = userIdResponse.data.user._id;

      const cartItemData = {
        productId: product._id,
        user: userId,
        quantity: 1,
        size: currentSize !== 0 ? currentSize : null,
      };

      const response = await axios.post(
        `http://10.0.2.2:8000/api/carts/`,
        cartItemData
      );

      if (response.status === 200) {
        setIsInCart(true);
        Alert.alert("Item added to cart successfully!");
      } else {
        Alert.alert("Failed to add item to cart. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Alert.alert("Failed to add item to cart. Please try again later.");
    }
  };

  const handleSelectSize = (size) => {
    if (size === currentSize) setCurrentSize(0);
    else setCurrentSize(size);
  };

  return (
    <View style={tw`flex-1`}>
      <SafeAreaView
        style={tw`absolute top-8 left-0 right-0 w-full flex flex-row justify-between px-4 pt-2 z-20`}
      >
        <TouchableOpacity
          style={tw`items-start`}
          onPress={() => navigate.goBack()}
        >
          <Icon
            name="arrow-back"
            size={24}
            color="#fff"
            style={tw`bg-gray-800 p-1 rounded-xl`}
          />
        </TouchableOpacity>
      </SafeAreaView>
      {!product ? (
        <Loading />
      ) : (
        <>
          <ScrollView
            style={tw`flex-1 mt-7.5 bg-stone-950 ${styles.container}`}
          >
            <View style={tw`w-full rounded-b-xl pb-2`}>
              <ImageBackground
                source={{
                  uri: currentImage,
                }}
                style={{
                  width: "auto",
                  height: 400,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {product.image && product.image.length > 0 && (
                  <View
                    style={tw`flex flex-row items-start justify-center gap-4 p-2
                  ${product.image.length === 0 && "hidden"}`}
                  >
                    {product.image.map((image, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setCurrentImage(image)}
                          key={index}
                          style={tw`flex rounded-full overflow-hidden p-1 bg-gray-500`}
                        >
                          <Image
                            source={{ uri: image }}
                            style={{
                              width: 50,
                              height: 50,
                              opacity: currentImage === image ? 1 : 0.3,
                              borderRadius: 50,
                            }}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </ImageBackground>
            </View>

            <View style={tw`w-full flex p-2`}>
              <Text style={tw`text-white font-black text-[1.5rem]`}>
                {product.productName}
              </Text>
              <View style={tw`flex-1 items-start gap-2 py-4`}>
                <Text style={tw`text-white opacity-50`}>
                  Detailed information:
                </Text>
                <View style={tw`flex-1 items-start gap-2 px-4`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Icon
                      type="font-awesome"
                      name="diamond"
                      size={16}
                      color="#fff"
                    />
                    <Text style={tw`text-slate-200 text-sm font-light`}>
                      Type: {product.diamondId.type}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Icon
                      type="font-awesome-5"
                      name="ring"
                      size={16}
                      color="#fff"
                    />
                    <Text style={tw`text-slate-200 text-sm font-light`}>
                      {product.shellId.category.charAt(0).toUpperCase() +
                        product.shellId.category.substring(1)}{" "}
                      brand: {product.shellId.shellName}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Icon
                      type="material-community"
                      name="gold"
                      size={16}
                      color="#fff"
                    />
                    <Text style={tw`text-slate-200 text-sm font-light`}>
                      {product.shellId.category.charAt(0).toUpperCase() +
                        product.shellId.category.substring(1)}{" "}
                      material: {product.materialId.materialName}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={tw`flex-1 items-start gap-2 py-4`}>
                <View style={tw`flex-row items-center gap-4`}>
                  <Text style={tw`text-white opacity-50`}>Available size:</Text>
                  <View style={tw`flex-row items-center gap-2`}>
                    {product.shellId.size.map((size, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => handleSelectSize(size)}
                          key={index}
                          style={tw`min-w-8 min-h-8 flex items-center justify-center rounded-xl bg-white ${
                            currentSize !== size &&
                            "bg-black border border-white"
                          }`}
                        >
                          <Text
                            style={tw`${currentSize !== size && "text-white"}`}
                          >
                            {size}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <Text style={tw`text-white italic text-xs px-8`}>
                  We can help in size selecting unless you do not know the exact
                  one.
                </Text>
              </View>

              <View style={tw`flex-1 items-start gap-2 py-4`}>
                <Text style={tw`text-white opacity-50`}>Description</Text>
                <Text style={tw`text-slate-200 text-sm font-light`}>
                  {product.description}
                </Text>
              </View>

              <View style={tw`min-h-16`} />
            </View>
          </ScrollView>

          <View
            style={tw`w-full bg-stone-800 absolute bottom-0 left-0 right-0 flex-row items-center rounded-t-xl px-4 py-2`}
          >
            <View style={tw`flex gap-1`}>
              <Text style={tw`text-xs text-white`}>Price</Text>
              <Text style={tw`text-lg text-white font-semibold`}>
                $ {CurrencySplitter(Math.round(product.price))}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={isInCart}
              style={tw`grow ml-4 px-2 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
                isInCart ? "bg-green-600" : "bg-white"
              }`}
            >
              {isInCart ? (
                <Icon
                  type="antdesign"
                  name="checkcircle"
                  size={16}
                  color="#fff"
                />
              ) : (
                <Icon type="zocial" name="cart" size={16} color="#000" />
              )}
              <Text
                style={tw`${
                  isInCart && "text-white"
                } flex-row items-center font-semibold`}
              >
                {isInCart ? "ADDED" : "ADD"} TO CART
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ProductDetail;
