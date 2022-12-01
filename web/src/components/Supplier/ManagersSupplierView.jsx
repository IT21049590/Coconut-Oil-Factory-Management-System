import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import ManagerHeader from "./supManagerHeader";
import Swal from 'sweetalert2'

  

function ViewSuppliers(){

    const [supDetails,setDetails] = useState([]);
    const [serQuery,setSearch] = useState("");


    function getAllSupliers(){
        axios.get("http://localhost:8889/supplier/supplymanager/allsuppliers").then((res)=>{
           
            setDetails(res.data)
        })
    }

    

    useEffect(function(){
        getAllSupliers();
    },[]);


    console.log(supDetails[0])

    function Searchfun(e){
        
        setSearch(e.target.value)

    }

    function downloadPDF(){
        let timerInterval
            Swal.fire({
            title: 'Preparing your PDF',
            html: 'Please wait <b></b> milliseconds.',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
            }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
            }).then(()=>{







                const doc = new jsPDF('p','pt','a4');

                var width = doc.internal.pageSize.getWidth();
            var hight = doc.internal.pageSize.getHeight()

           
             var pageSize = doc.internal.pageSize;
             // jsPDF 1.4+ uses getHeight, <1.4 uses .height
             var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
             // jsPDF 1.4+ uses getWidth, <1.4 uses .width
             var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
 
             doc.autoTable({
                 html: '#my-table',
                 startY: pageHeight - 700,
                 theme: 'grid'
             });

             var today = new Date();
                var curr_date = today.getDate();
                var curr_month = today.getMonth();
                var curr_year = today.getFullYear();
          
                today = [curr_month + 1] + "/ " + curr_date + "/ " + curr_year;
                var newdat = today;
 

           
            
            doc.addImage(imgData,'PNG',0,0,width,hight)
           // doc.text("Available Supplies",20,10);
           doc.text(newdat,450,108);
                doc.autoTable({
                      head: [['ID', 'Sup Uname', 'Nic','Phone Number']],
                      body:  supDetails.filter(items=>
    
                        items.username.toLowerCase().includes(serQuery) ||
                        items.nic.toLowerCase().includes(serQuery) ||
                        items.telephoneNum.toLowerCase().includes(serQuery)
                            
                            ).map(function(items,index){
                                      return( 
                                     [ index+1 ,
                                      items.username , 
                                      items.nic,
                                      items.telephoneNum
                                    ] 
                                         
                                                
                                      );
                            }) 
    
                            })
                
    
                doc.save("Supplier Details.pdf");

            })
      

    }

    function deleteRow(event){
            console.log(event)



            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete("http://localhost:8889/supplier/supplymanager/supplyerdelete/"+event).then((res)=>{
                       // alert(res.data);
                       Swal.fire(
                        'Deleted!',
                        'Supplier has been deleted.',
                        'success'
                      ).then(()=>{
                        getAllSupliers();
                      })
                    })
                  
                }
              })




            


    }


    return(<div className="supbg">


        <ManagerHeader/>
       

<h1 className='mb-4 hometext5 textbg'> <u>Supplier Details</u> </h1>
<div className="float-right serfun">
<div className="d-flex ">
<input onChange={Searchfun} placeholder="Search...." className="form-control searchbar"/>
<button onClick={downloadPDF} className="btn btn-secondary pdfbtn"><i className="bi bi-file-earmark-arrow-down-fill "></i>  Download PDF</button>
</div>
</div>
<br /><br />
<div>
<table className="table table-striped table-hover tabalebg">
<thead class="formheadcol">
<tr>
<th scope="col">Count</th>
<th scope="col">User Name</th>
<th scope="col">Nic</th>
<th scope="col">Contact Number</th>
<th scope="col">Delete supplier</th>

</tr>
</thead>

<tbody>
{
supDetails.filter(items=>

    items.username.toLowerCase().includes(serQuery) ||
    items.nic.toLowerCase().includes(serQuery) ||
    items.telephoneNum.toLowerCase().includes(serQuery)
    
    ).map(function(items,index){
          return( <tr>
          <td>{index+1} </td>
          <td>{items.username}  </td>
          <td>{items.nic}</td>
          <td>{items.telephoneNum}</td>
          {/* <td><button  onClick={e=>deleteRow(items._id)} >Delete</button></td> */}
          <td><button type="button" class="btn btn-danger test" onClick={e=>deleteRow(items._id)}>
          <i class="bi bi-trash text-light"></i> Delete
        </button></td>
          </tr>
                   
                    
          );
})

}
</tbody>
</table> 
</div>


{/* ------------------------------ */}



{/* ------------------------------ */}

    </div>)
}

export default ViewSuppliers;