module.exports = {
  generateSecreteNumber: () => {
    return (Math.random() * (9.99 - 0)).toFixed(2);
  },

  generateGussedNumber: () => {
    const number = (9.99 - 0).toFixed(2);
    const allguessedNumbers = [...Array(4).keys()].map(
      (i) => +(Math.random() * number).toFixed(2)
    );
    return allguessedNumbers;
  },
};
