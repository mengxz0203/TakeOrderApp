import React, { useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const foodsList = [];

      for (let i = 1; i <= 20; i++) {
        const url = `https://www.xiachufang.com/explore/?page=${i}`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
          },
        });

        const { data } = response;
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const inf = htmlDoc.querySelectorAll(
          '.recipe.recipe-215-horizontal.pure-g.image-link.display-block'
        );

        inf.forEach((food) => {
          const foodName = food.querySelector('img').getAttribute('alt');
          const foodIngredients = food.querySelector('p.ing.ellipsis').textContent;
          const foodHref = `https://www.xiachufang.com/${food.querySelector('a').getAttribute('href')}`;
          foodsList.push({ foodName, foodIngredients, foodHref });
          console.log(`菜名: ${foodName}\n用料: ${foodIngredients}\n链接: ${foodHref}\n`);
        });
      }
      console.log(foodsList);
      // Do something with the foodsList array
    };
    fetchData();
  }, []);

  return <div>Fetching data...</div>;
};

export default MyComponent;
