const calculatePercentage = (amount, total) => {
  let percentage = 0;

  if (amount > 0) {
    percentage = (amount / total) * 100;
  }

  if (percentage === 0) {
    return `${amount} (0%)`;
  }

  if (percentage < 1) {
    return `${amount} (<1%)`;
  }

  return `${amount} (${Math.floor(percentage)}%)`;
};

export default calculatePercentage;
