import { Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, VStack, Textarea, Switch, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../constant";
import { Product } from "../types/product";

type ProductFormProps =
{
    isOpen:boolean;
    onClose:()=>void;
    fetchProduct:()=>void;
    currentData?:Product;
}

const ProductForm = ({isOpen,onClose,fetchProduct,currentData} : ProductFormProps) => {
  //untuk add
  // const [product,setProduct] = useState({
  //   id:0,
  //   name:'',
  //   description:'',
  //   price:0,
  //   isInStore:false,
  // });

  //dimodifikasi agar bisa add and update
  const [product,setProduct] = useState({
    id:currentData?.id || 0,
    name:currentData?.name || '',
    description:currentData?.description || '',
    price:currentData?.price || 0,
    isInStore:currentData?.isInStore || false,
  });

  //Alert notif success
  const toast = useToast();

  const onSave = () => {
    if(currentData?.id){
      editProduct();
    }
    else{
      addProduct();
    }
  }

  const editProduct = () => {
    // console.log(product);  
    // Validasi input
    if (product.name.trim() === '' || product.description.trim() === '' || product.price <= 0) {
      toast({
        title:'Invalid Input',
        description:'Please fill in all fields correctly',
        status:'error',
        isClosable:true,
        duration:5000
      });
      return;
    }

    axios.put(BASE_URL + "product/" + currentData?.id,product).then(() => {
      // console.log(res);  
      toast({
        title:'Product Updated',
        description:'Product Updated successfully',
        isClosable:true,
        duration:1000
      })

      // Membersihkan formulir
      setProduct({
        id:0,
        name:'',
        description:'',
        price:0,
        isInStore:false,
      });

      onClose();
      fetchProduct();
    }).catch((error) => {
      console.log(error);   

      toast({
        title:'Error',
        description:'Failed to add product',
        status:'error',
        isClosable:true,
        duration:5000
      });
    })
  }

  const addProduct = () => {
    // console.log(product);  
    // Validasi input
    if (product.name.trim() === '' || product.description.trim() === '' || product.price <= 0) {
      toast({
        title:'Invalid Input',
        description:'Please fill in all fields correctly',
        status:'error',
        isClosable:true,
        duration:5000
      });
      return;
    }

    axios.post(BASE_URL + "product",product).then(() => {
      // console.log(res);  
      toast({
        title:'Product Added',
        description:'Product Added successfully',
        isClosable:true,
        duration:1000
      })

      // Membersihkan formulir
      setProduct({
        id:0,
        name:'',
        description:'',
        price:0,
        isInStore:false,
      });

      onClose();
      fetchProduct();
    }).catch((error) => {
      console.log(error);   

      toast({
        title:'Error',
        description:'Failed to add product',
        status:'error',
        isClosable:true,
        duration:5000
      });
    })
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader shadow={'sm'}>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={4} alignItems={'self-start'}>
              <Input type="text" placeholder="Name.." value={product.name} 
                onChange={(e) => setProduct({...product,name:e.target.value})}
              />
              <Textarea placeholder="Product Description.." value={product.description}
                onChange={(e) => setProduct({...product,description:e.target.value})}
              />
              <Input type="number" placeholder="Price.." value={product.price}
                onChange={(e) => setProduct({...product,price:parseInt(e.target.value)})}
              />
              <Text>
                Is In Store?
              </Text>
              <Switch
                isChecked={product.isInStore}
                onChange={(e) => setProduct({...product,isInStore:e.target.checked})}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant={'ghost'} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProductForm