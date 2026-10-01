import { format } from "date-fns";

export const formatDate = (dateString) => {
    if (isToday(dateString)) {
        return "Today";
    }

    if (isTomorrow(dateString)) {
        return "Tomorrow";
    }

    const arr = dateString.split("-").map(num => Number(num));
    const date = new Date(arr[0], arr[1] - 1, arr[2]);

    const wordsFormat = format(date, "dd MMM");
    return wordsFormat;
}

const isToday = (dateString) => {
    const today = new Date();
    
    const dateArr = dateString.split("-").map(num => Number(num))
    const date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);

    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

const isTomorrow = (dateString) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateArr = dateString.split("-").map(num => Number(num))
    const date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);

    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
}

export const isOverdue = (dateString) => {
    const todayDateString = new Date().toISOString().split('T')[0];

    const todayDate = new Date(todayDateString);
    const targetDate = new Date(dateString);

    return targetDate < todayDate;
}