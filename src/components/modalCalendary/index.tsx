import { validatedDate } from '@/utils/validatedDate';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import moment from 'moment';
import { useState } from 'react';
import Calendar from 'react-calendar';



interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    setDateSelected: React.Dispatch<React.SetStateAction<string>>;
    date: Date;
}

export function ModalCalendary({ isOpen, onOpen, onClose, date, setDate, setDateSelected }: ModalInfoProps) {
    async function handleChange(date: Date) {
        const newDate = validatedDate(`${date?.getDate()}/${date?.getMonth() + 1}`)
        setDateSelected(newDate)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            if (!date) {
                const currentDate = moment().format('D:M');
                const newDate = validatedDate(currentDate)
                setDateSelected(newDate)
            }
            onClose()
        }}>
            <ModalOverlay />
            <ModalContent bg="barber.400">
                <ModalHeader color="white">Selecione a data</ModalHeader>
                <ModalCloseButton color="white" />

                <ModalBody alignItems="center" justifyContent="center" mb={4}>
                    <Calendar onChange={(e: Date) => {
                        setDate(e)
                        handleChange(e)
                    }} value={date} locale="pt-br" />
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}