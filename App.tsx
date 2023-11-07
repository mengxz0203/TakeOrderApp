/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Linking
} from "react-native";

import cheerio from "cheerio";
import { Button } from "@rneui/themed"
import axios from "axios";
import { Card, Divider, Header } from "@rneui/base";
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Food {
  foodName: string;
  foodImg: string
  foodIngredients: string;
  foodHref: string;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 30;

const validateURL = (url: string) => {
  const doubleSlashRegex = /([^:]\/)\/+/g;
  return url.replace(doubleSlashRegex, '$1');
}

const App = () => {

  // const [data, setData] = useState<Food[]>([])
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Food[]>([])
  const [randomData, setRandomData] = useState<Food>()
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (data.length == 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [data]);
  const handleCardPress = (href: string) => {
    console.log(href)
    const new_url = validateURL(href)
    console.log(new_url)
    Linking.openURL(new_url)
      .catch((error) => {
        // 处理打开链接失败的情况
        console.error('Failed to open URL:', error);
      });
  };

  const renderCard = ({ item }: { item: Food }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item.foodHref)}>
        <Card containerStyle={styles.card}>
          <Card.Title>{item.foodName}</Card.Title>
          <Card.Divider />
          <Card.Image
            source={{ uri: item.foodImg }}
            // style={{ resizeMode: "contain"}}

          />

        </Card>
      </TouchableOpacity>
    );
  };

  const handleSubmit = async () => {
    setLoading(true)
    // 处理提交逻辑
    const foodsList: Food[] = [];
    for (let i = 1; i <= 20; i++) {
      const url = `https://www.xiachufang.com/explore/?page=${i}`;
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
          },
        });

        const $ = cheerio.load(response.data);
        const inf = $('.recipe.recipe-215-horizontal.pure-g.image-link.display-block');

        inf.each((index, element) => {
          const foodName = $(element).find('img').attr('alt');
          const foodImg = $(element).find('img').attr('data-src')
          const foodIngredients = $(element).find('p.ing.ellipsis').text();
          const foodHref = `https://www.xiachufang.com/${$(element).find('a').attr('href')}`;
          foodsList.push({ foodName, foodImg, foodIngredients, foodHref } as Food);
          // console.log(`菜名: ${foodName}\n用料: ${foodIngredients}\n链接: ${foodHref}\n`);
        });
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    }

    // console.log(foodsList);

    setData(foodsList)
    setLoading(false)
  };

  const handleRandom = async () => {
    setRandomData(data[Math.floor(Math.random() * data.length)])
  }

  return (
    <SafeAreaProvider>
      <Header
        ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ['white', 'pink'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },

        }}
        containerStyle={{ height: 60 }}
      />
      <View style={{ flex: 9, flexDirection: "column"}}>
        <View
          style={{  padding: 10, flex: 1.8 }}
        >
          <Text
            style={{fontSize: 15, textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial' }}
          >
            下厨房本周最受欢迎菜谱
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.foodName}
            numColumns={2}
            renderItem={renderCard}
            contentContainerStyle={styles.cardContainer}
          />

        </View>
        <Divider
          style={{margin: 10}}
        />
        <View
          style={{ flex: 1.2, padding: 10 ,marginBottom: 60}}
        >
          <Text
            style={{fontSize: 15, textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial' }}
          >
            幸运星
          </Text>
          <View style={styles.randomCardContainer}>
            {randomData && (<TouchableOpacity onPress={() => handleCardPress(randomData.foodHref)}>
              <Card>
                <Card.Title>{randomData.foodName}</Card.Title>
                <Card.Divider />
                <Card.Image source={{ uri: randomData.foodImg }} />
                <Card.Divider />
                {/*<Card.FeaturedSubtitle>{item.foodHref}</Card.FeaturedSubtitle>*/}
              </Card>
            </TouchableOpacity>)}
          </View>

        </View>

      </View>
      <View style={styles.buttonContainer}>
        <Button
          // style={styles.button}
          color={"#ffb6c1"}
          title={"查询"}
          type={"solid"}
          loading={loading}
          buttonStyle={{ width: 150 }}
          onPress={handleSubmit}
        />
        <Button
          // style={styles.button}
          color={"#ffb6c1"}
          title={"摇骰子"}
          type={"solid"}
          buttonStyle={{width: 150}}
          onPress={handleRandom}
          disabled={disabled}
        />
      </View>
    </SafeAreaProvider>


  );
};

const styles= StyleSheet.create({
  heading: {
    height: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    // marginTop: 10
    // marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 10
  },
  button: {
    // flex: 1,
    // marginRight: 10,
    color: "#ffb6c1"
  },
  cardContainer: {
    justifyContent: 'center',
  },
  card: {
    width: cardWidth,
    margin: 10,
    // height: 200
  },
  randomCardContainer: {
    flex: 1,
    marginBottom: 10,
  },
});

export default App;
