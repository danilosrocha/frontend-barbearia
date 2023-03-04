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

import { FiUser, FiScissors } from 'react-icons/fi'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { ScheduleItem } from '../../pages/dashboard'

interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: ScheduleItem;
    finishService: () => Promise<void>;
    loadingFinish: boolean
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService, loadingFinish }: ModalInfoProps) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="barber.400">
                <ModalHeader color="white">Próximo</ModalHeader>
                <ModalCloseButton color="white" />

                <ModalBody>

                    <Flex align="center" mb={3}>
                        <FiUser size={28} color="#ffb13e" />
                        <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">{data?.customer}</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FiScissors size={28} color="#fff" />
                        <Text ml={3} fontSize="large" fontWeight="bold" color="white">{data?.haircut?.name}</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FaMoneyBillAlt size={28} color="#46ef75" />
                        <Text ml={3} fontSize="large" fontWeight="bold" color="white">R$ {Number(data?.haircut?.price).toFixed(2)}</Text>
                    </Flex>

                    <ModalFooter>
                        <Button
                            isLoading={loadingFinish} bg="button.cta" _hover={{ bg: '#ffb13e' }} mr={3} onClick={() => finishService()}
                        >
                            Finalizar Serviço
                        </Button>
                    </ModalFooter>
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}