import { ReactNode, useEffect, useState } from 'react'
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    useColorModeValue,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Spinner
} from '@chakra-ui/react'

import {
    FiScissors,
    FiClipboard,
    FiSettings,
    FiMenu
} from 'react-icons/fi'
import { IconType } from 'react-icons'

import Link from 'next/link'

interface LinkItemProps {
    name: string;
    icon: IconType;
    route: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Agenda', icon: FiScissors, route: '/dashboard' },
    { name: 'Cortes', icon: FiClipboard, route: '/haircuts' },
    { name: 'Minha Conta', icon: FiSettings, route: '/profile' },
]

export function Sidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loader, setLoader] = useState(true)

    const handleButtonClick = () => {
        setLoader(false);
        setTimeout(() => {
            setLoader(true);
        }, 1000);
    };


    return (
        <Box minH="100vh" bg="barber.900">
            <SidebarContent
                onClick={handleButtonClick}
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />

            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
                onClose={onClose}
            >
                <DrawerContent>
                    <SidebarContent onClose={() => onClose()} />
                </DrawerContent>
            </Drawer>

            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />

            <Box ml={{ base: 0, md: 60 }} p='0 20px 0 20px'>
                {loader ? children : (<Box display="flex" alignItems="center" justifyContent="center" minH="100vh">
                    <Spinner color='button.cta' speed='0.8s' size='lg' />
                </Box>)}
            </Box>
        </Box>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg="barber.400"
            borderRight="0.1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >

            <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
                <Link href="/dashboard">
                    <Flex cursor="pointer" userSelect="none" flexDirection="row">
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Barber</Text>
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">Client</Text>
                    </Flex>
                </Link>
                <CloseButton color="white" display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>

            {LinkItems.map(link => (
                <NavItem icon={link.icon} route={link.route} key={link.name}>
                    {link.name}
                </NavItem>
            ))}

        </Box>
    )
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactNode;
    route: string;
}

const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
    return (
        <Link href={route} style={{ textDecoration: 'none' }} >
            <Flex
                align="center"
                color="white"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'barber.900',
                    color: 'white'
                }}
                {...rest}
            >

                {icon && (
                    <Icon
                        mr={4}
                        fontSize="16"
                        as={icon}
                        _groupHover={{
                            color: 'white'
                        }}
                    />
                )}
                {children}
            </Flex>
        </Link>
    )
}


interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('barber.400', 'gray.900')}
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu color='white' />}
            />

            <Flex flexDirection="row">
                <Text ml={8} fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
                    Barber
                </Text>
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">
                    Client
                </Text>
            </Flex>
        </Flex>
    )
}