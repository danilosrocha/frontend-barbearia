import moment from 'moment';

export function validatedDate(date: string | Date) {
    const newDate = moment(date, "DD/MM").format("DD/MM")

    return newDate;
}
