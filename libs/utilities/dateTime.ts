export const effortBurnComputation = (created: Date, completed: Date) => {
  const create = new Date(created);
  const complete = new Date(completed);
  const effortBurn = (complete.getTime() - create.getTime()) / (1000 * 60);
  if (isNaN(effortBurn)) {
    return 0;
  }
  const hours = Math.floor(effortBurn / 60);
  const minutes = effortBurn % 60;
  const fractionalHours = hours + minutes / 60;

  return parseFloat(fractionalHours.toFixed(2));
};
