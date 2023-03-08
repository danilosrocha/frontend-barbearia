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

import { FiUser, FiScissors, FiTrash2 } from 'react-icons/fi'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { ScheduleItem } from '../../pages/schedule'
import { DiYeoman } from "react-icons/di";

interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: ScheduleItem;
    finishService: () => Promise<void>;
    cancelService: () => Promise<void>;
    loadingFinish: boolean
    loadingCancel: boolean
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService, loadingFinish, cancelService, loadingCancel }: ModalInfoProps) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="barber.400">
                <ModalHeader color="white">Próximo</ModalHeader>
                <ModalCloseButton color="white" />

                <ModalBody>

                    <Flex align="center" p="0 0 5px 0 " mb={3} borderBottom="1px solid #fff" w="95%" justify="space-between">
                        <Flex>
                            <FiUser size={30} color="#ffb13e" />
                            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">{data?.customer}</Text>
                        </Flex>
                        <Button isLoading={loadingCancel} color="white" onClick={cancelService} bg="transparent" _hover={{ bg: "transparent" }} >
                            <FiTrash2 size={30} color="#ff4040" />
                        </Button>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <DiYeoman size={28} color="#707ff3" />
                        <Text ml={3} fontSize="large" color="white">{data?.barber?.barber_name}</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FiScissors size={28} color="#fff" />
                        <Text ml={3} fontSize="large" color="white">{data?.haircut?.name}</Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FaMoneyBillAlt size={28} color="#46ef75" />
                        <Text ml={3} fontSize="large" color="white">R$ {Number(data?.haircut?.price).toFixed(2)}</Text>
                    </Flex>

                    <ModalFooter p="0 0 10px 0 ">
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