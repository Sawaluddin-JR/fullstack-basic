import { TableContainer,Text, Table, Thead, Tr, Th, Tbody, Td,  Box, Flex, Heading, Button, HStack, Avatar, Badge, useDisclosure, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, PopoverFooter, useToast } from '@chakra-ui/react'
import './App.css'
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { BASE_URL } from './constant'
import { useEffect, useState } from 'react'
import { Product } from './types/product'
import ProductSkeleton from './components/ProductSkeleton'
import ProductForm from './components/ProductForm'
import ViewDetail from './components/ViewDetail'

function App() {
  const [data,setData] = useState<Product[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);

  const {isOpen,onClose,onOpen} = useDisclosure();
  const [currentData,setCurrentData] = useState<Product>({} as Product);

  //untuk view
  const {isOpen:viewDialogOpen,onClose:viewDialogClose,onOpen:onViewDialogOpen} = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    fetchData();
  },[])

  const fetchData = () => {
    setIsLoading(true);
    axios.get(BASE_URL + "product").then((response) => {
      setData(response.data);
    }).catch((error) => {
      console.log(error)   
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const getProduct = (id:number) => {
    axios.get<Product>(BASE_URL+"product/"+id)
    .then((response) => {
      // console.log(response);    
      setCurrentData(response.data);
      onOpen();
    }).catch((err) => {
      console.log(err);   
    })
  }

  const handleAdd = () => {
    onOpen();
    setCurrentData({} as Product);
  }

  const onDeleteHandle = (id:number) => {
    axios.delete(BASE_URL + "product/" + id)
    .then(() => {
      // console.log(res); 
      toast({
        title:"Product Deleted",
        description:"Product Deleted Successfully",
        isClosable:true,
        duration:1000
      })
      fetchData();
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleViewDetail = (id:number) => {
    axios.get<Product>(BASE_URL + "product/" + id)
    .then((res) => {
      // console.log(res); 
      setCurrentData(res.data);
      onViewDialogOpen();
    }).catch((error) => {
      console.log(error);
    })
  }

  if(isLoading) return <ProductSkeleton/>
  return (
 <Box
 shadow={'md'}
 rounded={'md'}
 m={32}
 >
  <Flex px="5" justifyContent={'space-between'} alignItems={'center'} mb={5}>

    <Heading fontSize={20}>
      Product List
    </Heading>
    <Button colorScheme='blue' leftIcon={<AddIcon/>} onClick={() => handleAdd()}>
      Add Product
    </Button>
  </Flex>
   <TableContainer>
  <Table variant='striped'>
    <Thead>
      <Tr>
        <Th>Id</Th>
        <Th>Name</Th>
        <Th>Description</Th>
        <Th>Is In Store?</Th>
        <Th isNumeric>Price</Th>
        <Th>Actions</Th>
      </Tr>
    </Thead>
    <Tbody>
      {
        data.map((product : Product) => (
          <Tr key={product.id}>
            <Td>{product.id}</Td>
            <Td>
              <HStack>
                <Avatar size={'sm'} name={product.name}/>
                <Text>{product.name}</Text>
              </HStack>
            </Td>
            <Td>{product.description}</Td>
            <Td>
              <Badge>
                {product.isInStore ? 'Yes' : 'No'}
              </Badge>
            </Td>
            <Td isNumeric>Rp.{product.price},-</Td>
            <Td>
              <HStack>
                <EditIcon boxSize={22} color={'blue'} gap={3} onClick={() => getProduct(product.id)}/>
                <Popover>
                  <PopoverTrigger>
                    <DeleteIcon boxSize={22} color={'red'}/>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Confirmation!</PopoverHeader>
                    <PopoverBody>
                      Are you sure you delete this?
                    </PopoverBody>
                    <PopoverFooter>
                      <Button colorScheme='red' float={'right'} onClick={() => onDeleteHandle(product.id)}>Delete</Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
                <ViewIcon boxSize={22} color={'green'}
                  onClick={() => handleViewDetail(product.id)}
                />
              </HStack>
            </Td>
          </Tr>
        ))
      }
    </Tbody>
  </Table>
</TableContainer>
  {
    data.length == 0 && <Heading textAlign={'center'} p={5} fontSize={14}>
      No Data
    </Heading>
  }
  {
    isOpen && <ProductForm 
    isOpen={isOpen} 
    onClose={onClose} 
    fetchProduct={fetchData} 
    currentData={currentData}
    />
  }

  {
    viewDialogOpen && <ViewDetail
      isOpen={viewDialogOpen}
      onClose={viewDialogClose}
      currentData={currentData}
    />
  }
 </Box>
)}

export default App
