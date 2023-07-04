import { useEffect, useState, useContext } from "react";
import Container from "../../components/container";
import PanelHeader from "../../components/panelHeader";
import { FiTrash2 } from "react-icons/fi";
import { formatedPrice } from "../../services/formatedPrice";

import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../contexts/AuthContext";

interface IimageProps {
  name: string;
  uid: string;
  url: string;
}

interface IMyProductsProps {
  id: string;
  name: string;
  year: string;
  price: number;
  city: string;
  brand: string;
  uid: string;
  images: IimageProps[];
}

function Dashboard() {
  const [myProducts, setMyProducts] = useState<IMyProductsProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadingProducts() {
      if (!user?.uid) {
        return;
      }

      const productsRef = collection(db, "products");
      const queryRef = query(productsRef, where("uid", "==", user.uid));

      getDocs(queryRef).then((snapshot) => {
        let listProducts = [] as IMyProductsProps[];

        snapshot.forEach((doc) => {
          listProducts.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            brand: doc.data().brand,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setMyProducts(listProducts);
      });
    }

    loadingProducts();
  }, [user]);

  async function handleDeleteProduct(product: IMyProductsProps) {
    const itemProduct = product;

    const docRef = doc(db, "products", itemProduct.id);
    await deleteDoc(docRef);

    itemProduct.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;

      const imageRef = ref(storage, imagePath);

      await deleteObject(imageRef);
    });

    setMyProducts(myProducts.filter((item) => item.id !== itemProduct.id));
  }

  return (
    <Container>
      <PanelHeader novo="Novo Anúncio" />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myProducts.map((product) => (
          <section
            key={product.id}
            className="w-full bg-white rounded-lg relative"
          >
            <button
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
              onClick={() => {
                handleDeleteProduct(product);
              }}
            >
              {" "}
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              src={product.images[0].url}
              alt="image"
              className="w-full  object-cover"
            />
            <p className="font-bold mt-1 px-2 mb-2">{product.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Ano: {product.year ? product.year : "Não informado"} | Marca:{" "}
                {product.brand}
              </span>
              <strong className="text-black font-bold mt-4">
                R$ {formatedPrice(product.price)}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-black">{product.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}

export default Dashboard;
