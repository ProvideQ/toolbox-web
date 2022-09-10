import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure
  } from '@chakra-ui/react'
import React from 'react';
import { JSXElementConstructor, ReactElement } from 'react';
import { BiHelpCircle } from 'react-icons/bi'
import { ProblemInputButton } from './ProblemInputButton'



export const ProblemInputButton_HelpButton = (props: {helpBody: ReactElement<any, string | JSXElementConstructor<any>>}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <ProblemInputButton icon={<BiHelpCircle />} onClick={onOpen} text="Get help" toolTipText="Get helpful explanations" />
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