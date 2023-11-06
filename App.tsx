/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from "react";
import {
  ScrollView,
  // useColorScheme,
  View,
  StyleSheet, Text
} from "react-native";

import cheerio from "cheerio";
import { List, WhiteSpace, Button } from "@ant-design/react-native";
import axios from "axios";

interface Food {
  foodName: string;
  foodIngredients: string;
  foodHref: string;
}

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const [data, setData] = useState<Food[]>([])
  const [loading, setLoading] = useState(false);

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
          const foodIngredients = $(element).find('p.ing.ellipsis').text();
          const foodHref = `https://www.xiachufang.com/${$(element).find('a').attr('href')}`;
          foodsList.push({ foodName, foodIngredients, foodHref } as Food);
          // console.log(`菜名: ${foodName}\n用料: ${foodIngredients}\n链接: ${foodHref}\n`);
        });
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    }

    console.log(foodsList);

    setData(foodsList)
    setLoading(false)
  };

  return (
    <View>

      <View>
        <WhiteSpace size={'xl'} />
        <WhiteSpace size={'xl'} />
      </View>

      <ScrollView style={styles.scrollView}>

        <List renderHeader={'每周最受欢迎菜谱'}>
         {data.map(item => (
            <View key={item.foodHref} style={styles.listItem}>
              <Text>{item.foodName}</Text>
            </View>
          ))}
        </List>

      </ScrollView>

      <View>
        <WhiteSpace size={'xl'} />
      </View>

      <View>
        <Button
          type={"primary"}
          onPress={handleSubmit}
          loading={loading}
        >
          查询
        </Button>
        <WhiteSpace />
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  scrollView: {
    maxHeight: 500, // 设置最大高度
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default App;
