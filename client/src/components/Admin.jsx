import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AgentsLogging from './AgentsLogging';
import {useNavigate} from "react-router-dom";


function Admin(){
    const [propertyData, SetPropertyData] = useState([]);
    const [editId, SetEditId] = useState();
    const [delId, SetDelId] = useState();
    const [propName, SetPropName] = useState([]);
    const [propLocation, SetPropLocation] = useState([]);
    const [propType, SetPropType] = useState([]);
    const [propLat, SetPropLat] = useState([]);
    const [propLong, SetPropLong] = useState([]);
    const [addPropIsShown, SetAddPropIsShown] = useState(false);
    const [editPropIsShown, SetEditPropIsShown] = useState(false);
    const navigate = useNavigate();
    
    const tabButtonActive = (e)=>{
       var tabTargetBtn =  e.target.className;
       var allTabs = document.querySelectorAll(".tabs");
       allTabs.forEach((element) =>{
        if(element.classList.contains(tabTargetBtn)){
            element.classList.add('tab_btn_active');
        }
        else{
            element.classList.remove('tab_btn_active');
        }
       })
    }
    
    const addPropPopup = ()=>{
        SetAddPropIsShown(true);
    }
    const addPropCloseBtn = ()=>{
        SetAddPropIsShown(false)
    }
    const addProp = (e)=>{
        e.preventDefault();
        SetAddPropIsShown(false);
        axios.post(`${process.env.REACT_APP_API_URL}/api/properties`,{
            name:propName,
            cityName:propLocation,
            type:propType,
            location:{
                type:"Point",
                coordinates:[parseFloat(propLong), parseFloat(propLat)]
            }
        },{withCredentials:true})
        .then((result) => {
            SetPropertyData((prev) => 
                [...prev, result.data])
        })
        .catch(()=>SetPropertyData("Error while Posting data"))
    }
    
    const edityPropPopUp = (id)=>{
        const selectedProperty = propertyData.find((x)=>x._id === id);
        if(selectedProperty){
            SetEditId(id)
            SetEditPropIsShown(true)

            SetPropName(selectedProperty.name);
            SetPropLocation(selectedProperty.cityName);
            SetPropType(selectedProperty.type);
            SetPropLat(selectedProperty.location.coordinates[1]);
            SetPropLong(selectedProperty.location.coordinates[0]);
        }
    }
    const editPropCloseBtn = ()=>{
        SetEditPropIsShown(false)
    }
    const edityPropSubmit = ()=>{
        
        axios.patch(`${process.env.REACT_APP_API_URL}/api/properties/${editId}`,{
            name:propName,
            cityName:propLocation,
            type:propType,
            location:{
                type:"Point",
                coordinates:[parseFloat(propLong), parseFloat(propLat)]
            }
        },{withCredentials:true})
        .then((result)=>SetPropertyData(prev=>
            prev.map((x)=>
                x._id === editId ?
                {...x, 
                    name:propName,
                cityName:propLocation,
                type:propType,
                location:{
                    type:"Point",
                    coordinates:[parseFloat(propLong), parseFloat(propLat)]
                }
                }: x
            )
        ))
        .catch(err=>console.log("error while editing property data"))
    }
    const deleteProp = (id)=>{
        axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/${id}`, {withCredentials:true})
        .then((result)=>SetPropertyData(prev=>
            prev.filter((x)=>
                x._id !== id
            ))
        )
        .catch((err)=>console.log(err))
    }
    ///////// log out \\\\\\\\\
    const logOut = (e)=>{
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/admin/logout`,{},{withCredentials:true})
        .then((response)=>{
            if(response.data.message === "LoggedOut"){
                navigate("/admin", {replace:true})
            }
        })
        .catch((err)=>console.error(err))     
    }

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/api/properties`, {withCredentials:true})
        .then((result)=>SetPropertyData(result.data))
        .catch(err=>SetPropertyData("Error while fectching data"))
    },[]);

    return(
        <div>
            <header className='header_bg'>
                <div className='logo_bg'>
                    <img src="./images/geofy-logo.png" alt="" width="100%"/>
                    {/* <p>logo</p> */}
                </div>
                <h2>Admin</h2>
               
                <button className='agent_route' onClick={logOut}>Log Out</button>
            </header>
            <section>
                <div className='tab_btn_bg'>
                    <button className='tab1' onClick={tabButtonActive}>Property List</button>
                    <button className='tab2' onClick={tabButtonActive}>Agent Loggins</button>
                </div>
                <div className='tabs tab1 tab_btn_active tab1Bg'>
                    <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Name</p>
                        { propertyData.length > 0 ?
                        propertyData.map((x)=>(
                            <div key={x._id}>
                               <p className='tabelCnt'>{x.name}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
                    </div>

                    <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Type</p>
                        { propertyData.length > 0 ?
                        propertyData.map((x)=>(
                            <div key={x._id}>
                                <p className='tabelCnt'>{x.type}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
                    </div>

                    <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Location</p>
                        { propertyData.length > 0 ?
                        propertyData.map((x)=>(
                            <div key={x._id}>
                                <p className='tabelCnt'>{x.cityName}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
                    </div>

                    <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Latitude</p>
                        { propertyData.length > 0 ?
                        propertyData.map((x)=>(
                            <div key={x._id}>
                                <p className='tabelCnt'>{x.location.coordinates[1]}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
                    </div>

                    <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Longitude</p>
                        { propertyData.length > 0 ?
                        propertyData.map((x)=>(
                            <div key={x._id}>
                                <p className='tabelCnt'>{x.location.coordinates[0]}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
                    </div>

                    <div className='tableHeading'>
                        <p className='addBtnProp' onClick={addPropPopup}>Add New Property</p>
                        { propertyData.length > 0 ?
                        propertyData.map((x)=>(
                            <div key={x._id} className='edi_del_bg'>
                                <button onClick={()=>edityPropPopUp(x._id)}>Edit</button>
                                <button onClick={()=>deleteProp(x._id)}>Delete</button>
                            </div>
                        )): <p>Loading...</p>
                    }
                    </div>
                    <div className='prp_lst_mob_bg'>
                        {propertyData.length > 0 ? propertyData.map((x)=>(
                            <div key={x._id} className='prp_lst_mob_card'>
                                <p className='prob_list_title_mob'>Name :</p>
                                <p className='prob_list_desc_mob'>{x.name}</p>
                                <p className='prob_list_title_mob'>Type :</p>
                                <p className='prob_list_desc_mob'>{x.type}</p>
                                <p className='prob_list_title_mob'>Location :</p>
                                <p className='prob_list_desc_mob'>{x.cityName}</p>
                                <p className='prob_list_title_mob'>Latitude :</p>
                                <p className='prob_list_desc_mob'>{x.location.coordinates[1]}</p>
                                <p className='prob_list_title_mob'>Longitude :</p>
                                <p className='prob_list_desc_mob'>{x.location.coordinates[0]}</p>
                                <div key={x._id} className='edi_del_bg'>
                                    <button onClick={()=>edityPropPopUp(x._id)}>Edit</button>
                                    <button onClick={()=>deleteProp(x._id)}>Delete</button>
                                </div>
                            </div>)): null
                        }
                    </div>
                    {/* ================== add property popup */}
                    {addPropIsShown ?
                    <div className='addPropForm'>
                        <button className='addPropFormCloseBtn' onClick={addPropCloseBtn}>
                            <i class="fa fa-times"></i>
                        </button>
                        <p>Add New Property</p>
                        <form>
                            <input type="text" placeholder='Property Name' required onChange={(e)=>SetPropName(e.target.value)}/>
                            <input type="text" placeholder='Property Location'required  onChange={(e)=>SetPropLocation(e.target.value)}/>
                            <input type="text" placeholder='Property Type'required  onChange={(e)=>SetPropType(e.target.value)}/>
                            <input type="text" placeholder='Property Latitude'required  onChange={(e)=>SetPropLat(e.target.value)}/>
                            <input type="text" placeholder='Property Longitude' required onChange={(e)=>SetPropLong(e.target.value)}/>
                            <input type="submit" value="Submit" onClick={addProp}/>
                        </form>
                    </div>:null}

                    {/* ================== edit property popup */}
                    {editPropIsShown ?
                    <div className='editPropForm'>
                        <button className='addPropFormCloseBtn' onClick={editPropCloseBtn}>
                            <i class="fa fa-times"></i>
                        </button>
                        <p>EditProperty</p>
                        <form >
                            <input type="text" placeholder='Property Name' required onChange={(e)=>SetPropName(e.target.value)} 
                            value={propName}/>
                            <input type="text" placeholder='Property Location' required onChange={(e)=>SetPropLocation(e.target.value)}
                            value={propLocation}/>
                            <input type="text" placeholder='Property Type' required onChange={(e)=>SetPropType(e.target.value)}
                            value={propType}/>
                            <input type="text" placeholder='Property Latitude' required onChange={(e)=>SetPropLat(e.target.value)}
                            value={propLat}/>
                            <input type="text" placeholder='Property Longitude' required onChange={(e)=>SetPropLong(e.target.value)}
                            value={propLong}/>
                            <input type="submit" value="Submit" onClick={edityPropSubmit}/>
                        </form>
                    </div> : null}
                </div>
                <div className='tabs tab2 tab2Bg'>
                    <AgentsLogging/>
                </div>
            </section>
            
            
        </div>
    )
}
export default Admin;