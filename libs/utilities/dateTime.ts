export const effortBurnComputation = (updated: Date, completed: Date) => {
  const update = new Date(updated);
  const complete = new Date(completed);
  const effortBurn = (complete.getTime() - update.getTime()) / (1000 * 60);
  if (isNaN(effortBurn)) {
    return 0;
  }
  const hours = Math.floor(effortBurn / 60);
  const minutes = effortBurn % 60;
  const fractionalHours = hours + minutes / 60;

  return parseFloat(fractionalHours.toFixed(2));
};

export const formatDate = (value: Date) => {
  const year = value.getFullYear().toString().padStart(2, "0");
  const month = (value.getMonth() + 1).toString().padStart(2, "0");
  const date = value.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${date}`;
};
