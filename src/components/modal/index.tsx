interface IModalProps {
  setShowModal: (value: boolean) => void;
  text: string;
}

const Modal = ({ setShowModal, text }: IModalProps) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white max-w-md w-full rounded-lg p-4 flex justify-center flex-col items-center ">
        <p>{text}</p>
        <button
          className="bg-red-500 text-white rounded-md px-4 py-2 mt-4"
          onClick={() => setShowModal(false)}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
