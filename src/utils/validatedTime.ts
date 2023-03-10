import moment from 'moment';

export function parseTimeString(startTime: string, endTime: string, workTime: number) {
    const timeSlots = [];
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    const workDuration = moment.duration(workTime, 'minutes');

    while (start.isBefore(end)) {
        const timeSlot = start.format('HH:mm');
        timeSlots.push(timeSlot);
        start.add(workDuration);
    }

    return timeSlots;
}

export function parseOneTimeString(startTime: string) {
    const result = startTime.split(" ")
    return result[0]
}

