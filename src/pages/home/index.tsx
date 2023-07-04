import Container from "../../components/container";
import { useEffect, useState, KeyboardEvent } from "react";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";
import { formatedPrice } from "../../services/formatedPrice";

interface IImageProductsProps {
  name: string;
  uid: string;
  url: string;
}

interface IProductsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: number;
  city: string;
  brand: string;
  model: string;
  images: IImageProductsProps[];
}

function Home() {
  const [allProducts, setAllProducts] = useState<IProductsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadingProducts();
  }, []);

  async function loadingProducts() {
    const productsRef = collection(db, "products");
    const queryRef = query(productsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      let listProducts = [] as IProductsProps[];

      snapshot.forEach((doc) => {
        listProducts.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          brand: doc.data().brand,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          model: doc.data().model,
          uid: doc.data().uid,
        });
      });

      setAllProducts(listProducts);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((previous) => [...previous, id]);
  }

  const handleSearchWithEnter = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  async function handleSearch() {
    if (!search) {
      loadingProducts();
      return;
    }

    setAllProducts([]);
    setLoadImages([]);

    const q = query(
      collection(db, "products"),
      where("model", ">=", search.toUpperCase()),
      where("model", "<=", search.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    let listProducts = [] as IProductsProps[];

    querySnapshot.forEach((doc) => {
      listProducts.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        brand: doc.data().brand,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        model: doc.data().model,
        uid: doc.data().uid,
      });
    });

    setAllProducts(listProducts);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Pesquise aqui o modelo desejado"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleSearchWithEnter}
        />
        <button
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Instrumentos novos e usados por todo Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allProducts.map((product) => (
          <Link to={`/produto/${product.id}`} key={product.id}>
            <section className="w-full bg-white rounded-lg">
              <div
                className="w-full h-72 rounded-lg bg-slate-200 "
                style={{
                  display: loadImages.includes(product.id) ? "none" : "block",
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all hover:cursor-pointer"
                src={product.images[0].url}
                alt="product"
                onLoad={() => {
                  handleImageLoad(product.id);
                }}
              />
              <p className="font-bold mt-1 mb-2 px-2">{product.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-600 mb-6">
                  Ano: {product.year ? product.year : "Não informado"} | Modelo:{" "}
                  {product.model}
                </span>
                <strong className="text-black font-mediu text-xl">
                  R$ {formatedPrice(product.price)}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-600">{product.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}

export default Home;
