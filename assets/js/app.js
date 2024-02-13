const cl = console.log;
const postForm = document.getElementById('postForm')
const postContainer = document.getElementById('postContainer')
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');

let baseurl = `https://jsonplaceholder.typicode.com`

let posturl = `${baseurl}/posts`

let postArray = [];

const onEdit = (ele) => {
    // cl(ele)
    let getEditId = ele.closest(".card").id;
    // cl(getEditId)
    localStorage.setItem('editId', getEditId);
    let getObjUrl = `${baseurl}/posts/${getEditId}`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', getObjUrl, true);

    xhr.send()

    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status < 300){
            // cl(xhr.response)
            let getObj = JSON.parse(xhr.response);
            // cl(getObj)
            titleControl.value = getObj.title;
            bodyControl.value = getObj.body;
            userIdControl.value = getObj.userId;

            submitBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
        }
    }
}

const onDelete = (ele) => {
    // cl(ele)
    let getDeleteId = ele.closest(".card").id;
    // cl(getDeleteId)
    let deleteUrl = `${baseurl}/posts/${getDeleteId}`

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', deleteUrl);
    xhr.send();
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status < 300){
            let card = document.getElementById(getDeleteId);
            cl(card)
            Swal.fire({
                title: "Do you want to Delete?",
                showDenyButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `No`
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    card.remove();
                  Swal.fire("Deleted!", "", "success");
                } else if (result.isDenied) {
                  Swal.fire("Your post is not Deleted", "", "info");
                }
              });

        }
    }
}


const postTemplating = (arr) => {
    arr.forEach (post => {
        postContainer.innerHTML += `
                 <div class="card mb-4" id="${post.id}">
                    <div class="card-header bg-success text-white text-capitalize">
                        <h2>${post.title}</h2>
                    </div>
                    <div class="card-body">
                    <p>
                            ${post.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn-lg btn btn-outline-primary"onclick="onEdit(this)">Edit</button>
                        <button class="btn-lg btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                  </div>

                    `
                });    
            }
            

    
    const onSubmitForm = (eve) => {
        eve.preventDefault();
        cl("kr")
        let obj = {
            title : titleControl.value,
            body : bodyControl.value,
            userId : userIdControl.value
        }
        postForm.reset();
        // cl(obj)
                    
                    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', posturl, true);
    xhr.send(JSON.stringify(obj));
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status < 300){
            // cl(xhr.response)
            obj.id = JSON.parse(xhr.response).id;
            cl(obj)
            postArray.push(obj)
            postTemplating(postArray)
            Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "New post is Added",
                    showConfirmButton: false,
                    timer: 1500
                  });
         }
    }   
}

const getPost = () => {
    let xhr = new XMLHttpRequest();
    
    xhr.open("GET", posturl, true);
    
    xhr.send();
    
    xhr.onload = function(){
        // cl(xhr.response);
        // cl(xhr.status);
        if(xhr.status >= 200 && xhr.status < 300){
             postArray = JSON.parse(xhr.response);
            cl(postArray);
            postTemplating(postArray)
            // Swal.fire({
            //         position: "center",
            //         icon: "success",
            //         title: "Post Templating is done",
            //         showConfirmButton: false,
            //         timer: 1500
            //       });
            }else{
                alert(`Something went wrong !!!`)
            }
        }
        
    }
    getPost()

const onUpdateHandler = () => {
    let updatedObj = {
        title : titleControl.value,
         body : bodyControl.value,
         userId : userIdControl.value
    }
    cl(updatedObj)
    let getEditId = localStorage.getItem('editId')
    cl(getEditId)
    let updatedUrl = `${baseurl}/posts/${getEditId}`

    let xhr = new XMLHttpRequest();
    xhr.open("PATCH",updatedUrl, true);
    xhr.send(JSON.stringify(updatedObj));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300 ){
            cl(xhr.response)
            let getIndexObj = postArray.findIndex(post => post.id == getEditId)
            cl(getIndexObj)
            postArray[getIndexObj].title = updatedObj.title;
            postArray[getIndexObj].body = updatedObj.body;
            postArray[getIndexObj].userId = updatedObj.userId
            // postTemplating(postArray)
            Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    postTemplating(postArray)
                  Swal.fire("Updated!", "", "success");
                } else if (result.isDenied) {
                  Swal.fire("Not Updated", "", "info");
                }
              });
            submitBtn.classList.remove('d-none');
            updateBtn.classList.add('d-none');
            postForm.reset();
        }
    }
}
updateBtn.addEventListener('click', onUpdateHandler)
postForm.addEventListener('submit', onSubmitForm)

