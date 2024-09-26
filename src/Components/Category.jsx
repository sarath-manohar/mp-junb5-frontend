import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap';
import {addCategoryAPI, deleteCategoryAPI, getAVideoAPI, getCategoryAPI, updateCategoryAPI} from '../../services/allAPI';
import VideoCard from './VideoCard'

function Category({dropVideoResponse}) {

  const[categoryName,setCategoryName]=useState("")
 const[allCategories,setAllCategories]=useState([])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

const handleAdd = async()=>{

if(categoryName){
  const result = await addCategoryAPI({categoryName,allVideos:[]})
  console.log(result);
  if(result.status>=200 && result.status<300){
    handleClose()
    setCategoryName("")
    getCategories()

  }else{
    alert(result.message)
  }
}else{
  alert("please fill the field")
}


}

useEffect(()=>{
getCategories()
},[dropVideoResponse])

const getCategories= async()=>{
 const {data}=  await getCategoryAPI()
//  console.log(data);
 setAllCategories(data)
 
}

console.log(allCategories);

const removeCategory = async(id)=>{
 await deleteCategoryAPI(id)
 getCategories()
}
const dragOver =(e)=>{
  console.log("video card dragging overv the category");
  e.preventDefault()
  
}

const videoDrop = async (e,categoryId)=>{

  const videoId = e.dataTransfer.getData("videoId")
  console.log("videoId" +videoId+ "videodropped inside category" +categoryId);
  const {data}= await getAVideoAPI(videoId)
  // console.log(data);
  const selectedCategory = allCategories.find(item=>item.id===categoryId)
  selectedCategory.allVideos.push(data)
  console.log(selectedCategory);
  await updateCategoryAPI(categoryId,selectedCategory)
  getCategories()
  
}

const videodragStarted =(e,videoId,categoryId)=>{
  let dataShare= {videoId,categoryId}
  e.dataTransfer.setData("data",(JSON.stringify(dataShare)))

}

  return (
    <>
    <div className='d-grid' >
      <button className='btn btn-info'  onClick={handleShow}>Add Category</button>
    </div>

    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered

      >
        <Modal.Header closeButton>
          <Modal.Title>Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <input type="text" className='form-control' placeholder='Enter Category Name' onChange={e=>setCategoryName(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>

{
  allCategories?.length>0?allCategories.map(category=>(
    <div className="border rounded mt-3 p-3" droppable="true" onDragOver={e=>dragOver(e)} onDrop={e=>videoDrop(e,category.id)}>
    <div className="d-flex justify-content-between align-items-center">
     <h3>{category.categoryName}</h3>
     <button className='btn' onClick={()=>removeCategory(category.id)}><i className="fa-solid fa-trash text-danger "></i></button>
    </div>
     <Row>
      {

        category?.allVideos?.length>0?category.allVideos.map(card=>(
          <Col sm={12} draggable  onDragStart={e=>videodragStarted(e,card.id,category.id)}>
          <VideoCard video={card} insideCategory={true}/>
          </Col>
        )):null
      
      }
     </Row>

   </div>
  )):<p className='text-danger fw-bolder'>Nothing to Display</p>
}


    </>
  )
}

export default Category
