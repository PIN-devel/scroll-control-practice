import { useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

// interface Airline {
//   id: number;
//   name: string;
//   coountry: string;
//   logo: string;
//   slogan: string;
//   head_quaters: string;
//   website: string;
//   established: string;
// }

interface Products {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
function App() {
  const listRef = useRef(null);
  const currentPageRef = useRef(0);
  const [products, setProducts] = useState<Array<Products>>([]);
  const [isLast, setIsLast] = useState(false);
  const [isScrollBottom, setIsScrollBottom] = useState(false);

  const getProducts = async (init?: boolean) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${
          currentPageRef.current * 10
        }`
      )
        .then((raw) => raw.json())
        .then((data) => data);
      const products = response.products;
      const isLast = response.total <= currentPageRef.current;

      init
        ? setProducts(products)
        : setProducts((prev) => prev.concat(products));
      setIsLast(isLast);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts(true);
  }, []);

  const handleScroll = throttle(1000, () => {
    if (listRef.current) {
      const { scrollHeight, offsetHeight, scrollTop } = listRef.current;

      const offset = 50;
      console.log(scrollHeight, offsetHeight, scrollTop);
      setIsScrollBottom(scrollHeight - offsetHeight - scrollTop < offset);
    }
  });

  useEffect(() => {
    if (isScrollBottom) {
      currentPageRef.current += 1;
      !isLast && getProducts();
    }
  }, [isScrollBottom, isLast]);

  return (
    <div className="App">
      <ul
        className="list"
        ref={listRef}
        onScroll={handleScroll}
        style={{
          overflow: "hidden scroll",
          listStyle: "none",
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100vh",
        }}
      >
        {!!products &&
          products.map((product) => (
            <li className="item" key={product.id}>
              <img
                src={product.images.at(-1)}
                alt=""
                style={{ width: "100%" }}
              />
              <h4>{product.title}</h4>
              <p>{product.description}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
