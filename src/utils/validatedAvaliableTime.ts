export function validatedAvaliableTime(avaliable_time: string[]) {

    const occupiedTimes = avaliable_time.map(timeString => {
        const [hourString, minuteString] = timeString.split(':');
        return {
            hour: parseInt(hourString),
            minute: parseInt(minuteString)
        };
    });

    return occupiedTimes;
}

export async function createSchedule(startTime, duration) {
    const occupiedTimes = [];
    let time = new Date();
    time.setHours(startTime.hour);
    time.setMinutes(startTime.minute);

    while (duration > 0) {
        occupiedTimes.push({
            hour: time.getHours(),
            minute: time.getMinutes()
        });
        time.setMinutes(time.getMinutes() + 10);
        duration -= 10;
    }

    return occupiedTimes;
}

export function verifyTimeAvailable(cutSchedule, availableTimes) {
    const occupiedTimes = [];
    const newAvailableTimes = availableTimes.filter((time) => {
        const { hour, minute } = time;
        const index = cutSchedule.findIndex((schedule) => schedule.hour === hour && schedule.minute === minute);
        if (index !== -1) {
            occupiedTimes.push({ hour, minute });
            return false; // remove o horário agendado da nova matriz
        }
        return true; // mantém o horário na nova matriz
    });
    return { newAvailableTimes, occupiedTimes };
}

export function returnModelTime(times) {
    const timeStrings = times.map(time => {
        const hour = time.hour < 10 ? `0${time.hour}` : time.hour;
        const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
        return `${hour}:${minute}`;
    });
    return timeStrings
}





