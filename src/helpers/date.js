import { format } from "date-fns";

export const formatDate = (dateString) => {
    const arr = dateString.split("-").map(num => Number(num))
    const date = new Date(arr[0], arr[1] - 1, arr[2]);
    const wordsFormat = format(date, "dd MMM");
    return wordsFormat;
}

export const isOverdue = (dateString) => {
    const todayDateString = new Date().toISOString().split('T')[0];

    const todayDate = new Date(todayDateString);
    const targetDate = new Date(dateString);

    return targetDate < todayDate;
}