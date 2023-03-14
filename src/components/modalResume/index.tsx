import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex,
} from '@chakra-ui/react'

import { FiUser, FiScissors, FiTrash2, FiClock } from 'react-icons/fi'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { ScheduleItem } from '../../pages/schedule'
import { DiYeoman } from "react-icons/di";

interface CutInfo {
    customer: string
    haircut: Haircut
    barber: Barber
    time: string
    date: string
}

interface Haircut {
    id: string
    name: string
    price: number
    time: string
}

interface Barber {
    id: string
    barber_name: string
    hair_cuts: number
    status: boolean
    available_at: string[]
    haircuts: Haircut2[]
}

interface Haircut2 {
    id: string
    name: string
    price: number
    time: string
}

interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    openResume: boolean
    data: CutInfo
    setOpenResume: React.Dispatch<React.SetStateAction<boolean>>;
}


export function ModalResume({ isOpen, onOpen, onClose, openResume, setOpenResume, data }: ModalInfoProps) {

    if (openResume) {
        onOpen()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            onClose()
            setOpenResume(false)
        }}>
            <ModalOverlay />
            <ModalContent bg="barber.400">
                <ModalHeader color="white">Resumo do agendamento</ModalHeader>
                <ModalCloseButton color="white" />

                <ModalBody>

                    <Flex align="center" p="0 0 5px 0 " mb={3} borderBottom="1px solid #fff" w="95%" justify="space-between">
                        <Flex>
                            <FiUser size={30} color="#ffb13e" />
                            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">{data?.customer}</Text>
                        </Flex>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <DiYeoman size={28} color="#8d8e9b" />
                        <Text ml={3} fontSize="large" color="white">{data?.barber?.barber_name}</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FiClock size={28} color="#df6868" />
                        <Text ml={3} fontSize="large" color="white">{data?.date} - {data?.time}h</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FiScissors size={28} color="#fff" />
                        <Text ml={3} fontSize="large" color="white">{data?.haircut?.name}</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FaMoneyBillAlt size={28} color="#46ef75" />
                        <Text ml={3} fontSize="large" color="white">R$ {Number(data?.haircut?.price).toFixed(2)}</Text>
                    </Flex>

                </ModalBody>

            </ModalContent>
        </Modal>
    )
}