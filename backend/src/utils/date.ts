import { add, differenceInDays, sub } from "date-fns";

export const oneYearFromNow = () => {
    return add(new Date(), { years: 1 });
};

export const thirtyDaysFromNow = () => {
    return add(new Date(), { days: 3 });
};

export const fifteenMinutesFromNow = () => {
    return add(new Date(), { minutes: 15 });
};

export const fiveMinutesAgo = () => {
    return sub(new Date(), { minutes: 5 });
};

export const oneHourFromNow = () => {
    return add(new Date(), { hours: 1 });
};

export const lessThanOneDay = (time: Date) => {
    // const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    // return time.getTime() - Date.now() <= ONE_DAY_IN_MS;

    return differenceInDays(time, new Date()) === 0;
};
