import React, { useEffect, useState } from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { Button, Flex } from '@chakra-ui/react';
import { createSchedule, returnModelTime, verifyTimeAvailable } from '@/utils/validatedAvaliableTime';
import { toast } from 'react-toastify';

interface OccupiedTime {
    hour: Number,
    minute: Number
}

export default function SelectTime({ availableTime, timeUsed, initialAvailableTime, timesAlreadyUsed, setTimeToUsed, setOpenResume }) {
  
    const [value, setValue] = useState(null);
    const [occupiedTimes, setOccupiedTimes] = useState<OccupiedTime[]>();
    const [enableMinute, setEnableMinute] = useState(false);
    const [cutSchedule, setCutSchedule] = useState<OccupiedTime[]>();
    const [newAvailableTimes, setNewAvailableTimes] = useState<OccupiedTime[]>();
    const [freeTime, setFreeTime] = useState<boolean>();
    const [timesAlreadyUse, setTimesAlreadyUse] = useState<OccupiedTime[]>(timesAlreadyUsed);

    function handleConfirmTime() {
        for (let i = 0; i < cutSchedule.length; i++) {
            const { hour, minute } = cutSchedule[i];
            const index = availableTime.findIndex(time => time.hour === hour && time.minute === minute);
            if (index === -1) {
                toast.warning("Seu corte requer mais tempo, há um cliente agendado no próximo horário..")
                setFreeTime(false);
                const concatenatedArray = [...timesAlreadyUsed, ...cutSchedule];
                setTimesAlreadyUse(concatenatedArray)
                return false

            }
        }
        toast.success("Horário disponível! Confirme o agendamento")
        setFreeTime(true);
        setTimeToUsed(returnModelTime(cutSchedule))

        const concatenatedArray = [...timesAlreadyUsed, ...cutSchedule];

        setTimesAlreadyUse(concatenatedArray)
        setOpenResume(true)

        return true
    }

    async function handleCreateSchedule(startTime) {

        const response = await createSchedule(startTime, timeUsed)
        setCutSchedule(response)

        const { newAvailableTimes, occupiedTimes } = verifyTimeAvailable(response, availableTime);

        setOccupiedTimes(occupiedTimes);
        setNewAvailableTimes(newAvailableTimes)
    }

    const disabledHours = () => {
        const availableHours = [];

        const initialTime = parseInt(initialAvailableTime[0]?.hour);
        const finalTime = parseInt(initialAvailableTime[initialAvailableTime.length - 1]?.hour);
        for (let i = 0; i < 24; i++) {
            if (i < initialTime || i >= finalTime + 1) {
                availableHours.push(i);
            }
        }
        return availableHours;
    };


    const disabledMinutes = (selectedHour) => {
        const minutes = [];
        for (let i = 0; i < timesAlreadyUse.length; i++) {
            if (selectedHour === timesAlreadyUse[i].hour) {
                minutes.push(timesAlreadyUse[i].minute);
            }
        }
        return minutes;
    };

    useEffect(() => {
        const now = moment(); 
        now.startOf('hour'); 
        setValue(now);
    }, [])

    return (
        <Flex >
            <TimePicker
                value={value}
                onChange={(value) => {
                    const startTime = {
                        hour: Number(value.hours()),
                        minute: Number(value.minutes())
                    }
                    setValue(value)
                    setEnableMinute(true)
                    handleCreateSchedule(startTime)
                }}
                showSecond={false}
                showMinute={enableMinute}
                format="HH:mm"
                allowEmpty={false}
                hideDisabledOptions={true}
                disabledMinutes={disabledMinutes}
                disabledHours={disabledHours}
                minuteStep={10}
                use12Hours={false}
                inputReadOnly
                className="timepicker"
            />
            {cutSchedule &&
                <Button
                    bg={freeTime ? "green.500" : (freeTime !== undefined ? "red.500" : "yellow.500")}
                    onClick={handleConfirmTime}
                    _hover={{
                        bg: freeTime ? "green.300" : (freeTime !== undefined ? "red.300" : "yellow.300")
                    }}
                >
                    OK
                </Button>}

        </Flex>
    );
};


