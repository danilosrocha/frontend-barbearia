import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    setDateSelected: React.Dispatch<React.SetStateAction<string>>;
    date: Date;
}

export function ModalCalendary({ isOpen, onOpen, onClose, date, setDate, setDateSelected }: ModalInfoProps) {
    function handleChange(date: Date) {
        setDateSelected(`${date?.getDate()}/${date?.getMonth() + 1}`)
        onClose()
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="barber.400">
                <ModalHeader color="white">Selecione a data</ModalHeader>
                <ModalCloseButton color="white" />

                <ModalBody alignItems="center" justifyContent="center">
                    <Calendar onChange={(e: Date) => {
                        setDate(e)
                        handleChange(e)
                    }} value={date} />
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}