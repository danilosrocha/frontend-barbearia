import { Flex } from '@chakra-ui/react';
import React from 'react';

function FadeIn({ children }) {
  return <Flex w='100%' className="fade-in">{children}</Flex>;
}

export default FadeIn;
