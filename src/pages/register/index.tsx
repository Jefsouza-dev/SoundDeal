import { useEffect, useContext, useState } from "react";
import Container from "../../components/container";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../contexts/AuthContext";
import Logo from "../../components/logo";
import { auth } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatótio"),

  password: z
    .string()
    .min(8, "A senha deve conter pelo menos 8 caracteres")
    .nonempty(" O campo senha é obrigatótio"),
});

type formData = z.infer<typeof schema>;

function Register() {
  const { handleInfoUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [msgForModal, setMsgForModal] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogOut() {
      await signOut(auth);
    }

    handleLogOut();
  }, []);

  const onSubmit = async (data: formData) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setMsgForModal("E-mail já está cadastrado");
          setShowModal(true);
          return;
        }
        alert("Algo não saiu como esperado, tente novamente mais tarde!");
      });
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/">
          <Logo />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Nome completo"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="E-mail"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
            type="submit"
          >
            Cadastrar
          </button>
        </form>

        <p>
          Já tem uma conta?{" "}
          <Link className="text-red-500 font-bold" to="/login">
            Entrar
          </Link>
        </p>

        {showModal && <Modal text={msgForModal} setShowModal={setShowModal} />}
      </div>
    </Container>
  );
}

export default Register;
