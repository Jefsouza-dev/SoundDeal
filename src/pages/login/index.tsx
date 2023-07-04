import { useEffect, useState } from "react";
import Container from "../../components/container";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "../../components/logo";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import Modal from "../../components/modal";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatótio"),

  password: z.string().nonempty(" O campo senha é obrigatótio"),
});

type formData = z.infer<typeof schema>;

function Login() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [msgForModal, setMsgForModal] = useState("");

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
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setMsgForModal("Usuário não encontrado. Crie sua conta!");
          setShowModal(true);
        } else {
          setMsgForModal("Verifique seu e-mail e/ou senha");
          setShowModal(true);
        }
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
            Acessar
          </button>
        </form>
        <p>
          Não tem uma conta?{" "}
          <Link className="text-red-500 font-bold" to="/cadastro">
            Crie a sua
          </Link>
        </p>

        {showModal && <Modal text={msgForModal} setShowModal={setShowModal} />}
      </div>
    </Container>
  );
}

export default Login;
