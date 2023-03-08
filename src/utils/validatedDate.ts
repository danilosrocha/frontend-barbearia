import moment from 'moment';

export async function validatedDate(date: string,) {
    const newDate = moment(date, "DD/MM").format("DD/MM")

    return newDate;
}
