import { ChangeEvent, useState, useContext } from "react";
import Container from "../../../components/container";
import Modal from "../../../components/modal";
import PanelHeader from "../../../components/panelHeader";
import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";
import Input from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { storage, db } from "../../../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const schema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  model: z.string().nonempty("Campo obrigatório"),
  year: z.string(),
  brand: z.string().nonempty("Campo obrigatório"),
  price: z.string().nonempty("Campo obrigatório"),
  city: z.string().nonempty("Campo obrigatório"),
  whatsapp: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((value) => /^\d{11,12}$/.test(value), {
      message: "Número de telefone inválido",
    }),
  description: z.string().nonempty("Campo obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface IImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [imagesLayout, setImagesLayout] = useState<IImageItemProps[]>([]);
  const [showModal, setShowModal] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      await handleUpload(image);
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imgItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };

        setImagesLayout((images) => [...images, imgItem]);
      });
    });
  }

  function onSubmit(data: FormData) {
    if (imagesLayout.length < 2) {
      setShowModal(true);
      return;
    }

    const listImages = imagesLayout.map((item) => {
      return {
        uid: item.uid,
        name: item.name,
        url: item.url,
      };
    });

    addDoc(collection(db, "products"), {
      name: data.name.toUpperCase(),
      model: data.model.toUpperCase(),
      whatsapp: data.whatsapp,
      city: data.city.toUpperCase(),
      year: data.year,
      brand: data.brand.toUpperCase(),
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: listImages,
    }).then(() => {
      alert("Cadastrado com sucesso");
      reset();
      setImagesLayout([]);
    });
  }

  async function handleDeleteImage(img: IImageItemProps) {
    const imagePath = `images/${img.uid}/${img.name}`;

    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);

      setImagesLayout(imagesLayout.filter((item) => item.url !== img.url));
    } catch (error) {
      console.log("erro ao deletar");
    }
  }

  return (
    <Container>
      <PanelHeader dashboard="Dashboard" />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 cursor-pointer">
        <button className="border-2 w=48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0  cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {imagesLayout.map((img) => (
          <div
            className="w-full h-32 flex items-center justify-center relative"
            key={img.name}
          >
            <button className="absolute" onClick={() => handleDeleteImage(img)}>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              className="rounded-lg w-full h-32 object-cover"
              src={img.previewUrl}
              alt="fotoDoInstrumento"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-7">
            <p className="mb-0 font-medium">Título do anúncio *</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              className="absolute"
            />
          </div>

          <div className="mb-7">
            <p className="mb-0 font-medium">Modelo *</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              className="absolute"
            />
          </div>

          <div className="flex w-full mb-7 flex-row items-center gap-4">
            <div className="w-1/2">
              <p className="mb-0 font-medium">Ano de fabricação</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                className="absolute"
              />
            </div>

            <div className="w-1/2">
              <p className="mb-0 font-medium">Marca *</p>
              <Input
                type="text"
                register={register}
                name="brand"
                error={errors.brand?.message}
                className="absolute"
              />
            </div>
          </div>

          <div className="flex w-full mb-7 flex-row items-center gap-4">
            <div className="w-1/2">
              <p className="mb-0 font-medium">Telefone / Whatsapp *</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                className="absolute"
              />
            </div>

            <div className="w-1/2">
              <p className="mb-0 font-medium">Cidade *</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                className="absolute"
              />
            </div>
          </div>

          <div className="mb-7 w-1/2">
            <p className="mb-0 font-medium">Preço *</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              className="absolute"
            />
          </div>

          <div className="mb-7">
            <p className="mb-0 font-medium">Descrição *</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description?.message}</p>
            )}
          </div>

          <button
            className="w-full rounded-md bg-zinc-900 text-white font-medium h-10 mb-8"
            type="submit"
          >
            Cadastrar
          </button>
        </form>

        {showModal && (
          <Modal
            text="Para publicar o seu anúncio de venda, é necessário anexar pelo menos duas fotos."
            setShowModal={setShowModal}
          />
        )}
      </div>
    </Container>
  );
}

export default New;
