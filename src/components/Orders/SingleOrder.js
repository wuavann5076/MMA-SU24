import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import dateFormat from "../../assistants/date.format";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import CurrencySplitter from "../../assistants/currencySpliter";

export default function SingleOrder({ order }) {
  const [itemList, setItemList] = useState([]);
  const [statusColor, setStatusColor] = useState("gray-500");

  const navigate = useNavigation();

  const fetchOrderItem = async () => {
    await axios
      .get(`http://10.0.2.2:8000/api/orderItems/order/${order._id}`)
      .then((res) => {
        console.log("OrderItems: ", res.data);
        setItemList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrderItem();
    switch (order.status) {
      case "IN DELIVERY": {
        setStatusColor("sky-700");
        break;
      }
      case "COMPLETED": {
        setStatusColor("green-700");
        break;
      }
      case "CANCELED": {
        setStatusColor("red-700");
        break;
      }
    }
  }, [order]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigate.navigate("OrderDetail", {
          order: order,
          items: itemList,
        })
      }
      style={tw`w-full flex-1 border border-white rounded-xl px-4 py-2`}
    >
      <View style={tw`w-full flex-row items-center justify-between`}>
        <View style={tw`flex items-start gap-1`}>
          <Text style={tw`text-white text-xl font-bold`}>
            #{order.transactionId}
          </Text>
          <Text style={tw`text-gray-400 text-xs flex-row items-center`}>
            {dateFormat(order.createdAt, "mmm dd, yyyy")}&ensp;|&ensp;
            {dateFormat(order.createdAt, "HH:mm")}
          </Text>
        </View>
        <Icon type="antdesign" name="right" size={12} color="#fff" />
      </View>

      <View style={tw`w-full flex-row items-center gap-1 py-2`}>
        {itemList.map((item, index) => {
          if (index < 5)
            return (
              <Image
                key={index}
                source={{ uri: item.product.image[0] }}
                key={index}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
            );
        })}
        {itemList.length > 5 ? (
          <Text style={tw`text-white text-xs px-2`}>
            +{itemList.length - 5}
          </Text>
        ) : null}
      </View>

      <View style={tw`w-full flex-row items-center gap-2`}>
        <View style={tw`grow items-start`}>
          <Text style={tw`text-stone-600 text-[0.7rem]`}>Products</Text>
          <Text style={tw`text-white`}>
            {itemList.length} product
            <Text style={tw`inline ${itemList.length < 2 && "hidden"}`}>s</Text>
          </Text>
        </View>

        <View style={tw`grow items-start`}>
          <Text style={tw`text-stone-600 text-[0.7rem]`}>Total</Text>
          <Text style={tw`text-white`}>
            $ <Text>{CurrencySplitter(parseFloat(order.total))}</Text>
          </Text>
        </View>

        <View style={tw`grow items-end`}>
          <Text
            style={tw`w-24 text-center font-bold py-1 rounded-lg text-white bg-${statusColor}`}
          >
            {order.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
