import { useEffect, useState } from "react";
import Container from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

import { Swiper, SwiperSlide } from "swiper/react";

interface ImagesProps {
  uid: string;
  name: string;
  url: string;
}

interface IProductProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  brand: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesProps[];
}

function Instrument() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProductProps>();
  const [sliderPreview, setSliderPreview] = useState<number>(2);
  const navigate = useNavigate();
  const msg = `Olá, vi seu anuncio da ${product?.model} e fiquei interessado(a)`;

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "products", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }

        setProduct({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          city: snapshot.data()?.city,
          model: snapshot.data()?.model,
          uid: snapshot.data()?.uid,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.whatsapp,
          price: snapshot.data()?.price,
          brand: snapshot.data()?.brand,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images,
        });
      });
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPreview(1);
      } else {
        setSliderPreview(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {product && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{ clickable: true }}
          navigation
        >
          {product?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img className="w-full h-96 object-cover" src={image.url} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {product && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{product?.name}</h1>
            <h1 className="font-bold text-3xl text-black">
              R$ {product?.price}
            </h1>
          </div>
          <p>{product?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{product?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{product?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>Marca</p>
                <strong>{product?.brand}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição:</strong>
          <p className="mb-4">{product?.description}</p>

          <strong>Telefone / WhatsApp</strong>
          <p>{product?.whatsapp}</p>

          <a
            className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium"
            href={`https://api.whatsapp.com/send?phone=${product?.whatsapp}&text=${msg}`}
            target="_blank"
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#FFF" />
          </a>
        </main>
      )}
    </Container>
  );
}

export default Instrument;
