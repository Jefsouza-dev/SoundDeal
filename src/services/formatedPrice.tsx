export const formatedPrice = (price: number) => {
  const formated = price.toLocaleString("pr-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formated;
};
