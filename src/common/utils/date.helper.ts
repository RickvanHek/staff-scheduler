import { addYears, subYears } from 'date-fns';

export const getFromToDate = (
  from?: Date,
  to?: Date,
): { from: Date; to: Date } => {
  if (!from && !to) {
    from = new Date();
    to = addYears(from, 1);
  } else if (!from && to) {
    from = subYears(to, 1);
  } else if (!to && from) {
    to = addYears(from, 1);
  }
  return { from, to };
};
