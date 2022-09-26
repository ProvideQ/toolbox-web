import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Icon
  } from '@chakra-ui/react'
import { JSXElementConstructor, ReactElement } from 'react';
import { BiHelpCircle } from 'react-icons/bi'
import { InputButton } from './InputButton'



export const HelpButton = (props: {helpBody: ReactElement<any, string | JSXElementConstructor<any>>}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <InputButton icon={<Icon as={BiHelpCircle}/>} onClick={onOpen} text="Get help" toolTipText="Get helpful explanations" />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Need some help?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {props.helpBody}
            </ModalBody>
    
            <ModalFooter>
              <Button colorScheme='teal' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}