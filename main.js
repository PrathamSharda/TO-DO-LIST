// checks if the slected length is zero or not if it is it make it go back to its natural state



//  function that displays the number.of boxes selected;
function ListeningTodo(){
    const deleteBtn=document.querySelector('.delete');
    const completeBtn=document.querySelector('.complete');
    deleteBtn.style.display='block';
    completeBtn.style.display='block';
    const checkboxes=document.querySelectorAll(".taskcreate input[type=checkbox]");
   const selectedBoxes=Array.from(checkboxes).filter(checkbox=>checkbox.checked);
   const sub=document.querySelector('.todosub');
   if (selectedBoxes.length==0){
    sub.textContent="TO DO";
    deleteBtn.style.display='none';
    completeBtn.style.display='none';
}else{
    sub.textContent=`${selectedBoxes.length} Selected`;
}
    
}
//  adding tasks from the Add tab to the todo tab;
document.querySelector(".addingValue").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission if inside a form
        addtask(); // Calls the function to add a new task
    }
});
//for listenign todo checkbox
document.querySelector(".taskcreate").addEventListener("click", (event) => {
    if (event.target.matches("input[type=checkbox]")) {
        ListeningTodo();
    }
});
//for listening completed checkbox
document.querySelector(".listele").addEventListener("click", (event) => {
    if (event.target.matches("input[type=checkbox]")) {
        ListeningCompleted();
    }
});
function addtask(){
    
    const value=document.querySelector(".addingValue").value;
    const div=document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const label=document.createElement("label");
    if(value==""){
        alert("enter something");
    }else{
    label.textContent=value;
    label.prepend(checkbox);
    checkbox.onclick=ListeningTodo;
    //checkbox.style.appearance='none';
    checkbox.classList.add('forCheckbox')
    div.appendChild(label);
    const parent=document.querySelector(".taskcreate");
    parent.appendChild(div);
}
}

//Delete button in TODO

function deleteTodo(){
    const checkboxes=document.querySelectorAll(".taskcreate input[type=checkbox]");
    const selectedBoxes=Array.from(checkboxes).filter(checkbox=>checkbox.checked);
    selectedBoxes.forEach(checkbox=>{
        const parentElement=checkbox.closest('li');
        if (parentElement){
            parentElement.remove();
        }
    })

    const sub=document.querySelector('.todosub');
    const deleteBtn=document.querySelector('.delete');
    const completeBtn=document.querySelector('.complete');
    sub.textContent='TO DO';
    deleteBtn.style.display='none';
    completeBtn.style.display='none';

}
//Complete button of Todo
function completeTodo(){
    const checkboxes=document.querySelectorAll(".taskcreate input[type=checkbox]");
    const selectedBoxes=Array.from(checkboxes).filter(checkbox=>checkbox.checked);
    selectedBoxes.forEach(checkbox=>{
        const value=checkbox.closest('label').innerHTML;

        if (value!=''){
            let truValue='';
            let l=2;
            for(let i=0;i<value.length;i++){
                if (l>=1){
                    if (value[i]=="<"||value[i]=='>'){
                        l--;
                    }else{
                        continue;
                    }
                }else{
                    truValue+=value[i];
                }
            }

            const div=document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const label=document.createElement("label");   
            label.textContent=truValue;
            label.prepend(checkbox);
            checkbox.onclick=ListeningCompleted;
            //checkbox.style.appearance='none';
            checkbox.classList.add('forCheckbox')
            div.appendChild(label);
            const parent=document.querySelector(".listele");
            parent.appendChild(div);
}
deleteTodo();
    })
}
function ListeningCompleted(){
    const deleteBtn=document.querySelector('.delete1');
    const completeBtn=document.querySelector('.complete1');
    deleteBtn.style.display='block';
    completeBtn.style.display='block';
    const checkboxes=document.querySelectorAll(".listele input[type=checkbox]");
   const selectedBoxes=Array.from(checkboxes).filter(checkbox=>checkbox.checked);
   const sub=document.querySelector('.completesub');
   if (selectedBoxes.length==0){
    sub.textContent="COMPLETED";
    deleteBtn.style.display='none';
    completeBtn.style.display='none';
}else{
    sub.textContent=`${selectedBoxes.length} Selected`;
}
}
//function to remove elements from the completed tab
function deleteCompleted(){
    const checkboxes=document.querySelectorAll(".listele input[type=checkbox]");
    const selectedBoxes=Array.from(checkboxes).filter(checkbox=>checkbox.checked);
    selectedBoxes.forEach(checkbox=>{
        const parentElement=checkbox.closest('li');
        if (parentElement){
            parentElement.remove();
        }
    })

    const sub=document.querySelector('.completesub');
    const deleteBtn=document.querySelector('.delete1');
    const completeBtn=document.querySelector('.complete1');
    sub.textContent='COMPLETED';
    deleteBtn.style.display='none';
    completeBtn.style.display='none';
}
//function to put elements back from completed tab to todo tab
function reverse(){
    const checkboxes=document.querySelectorAll(".listele input[type=checkbox]");
    const selectedBoxes=Array.from(checkboxes).filter(checkbox=>checkbox.checked);
    selectedBoxes.forEach(checkbox=>{
        const value=checkbox.closest('label').innerHTML;

        if (value!=''){
            let truValue='';
            let l=2;
            for(let i=0;i<value.length;i++){
                if (l>=1){
                    if (value[i]=="<"||value[i]=='>'){
                        l--;
                    }else{
                        continue;
                    }
                }else{
                    truValue+=value[i];
                }
            }

            const div=document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const label=document.createElement("label");   
            label.textContent=truValue;
            label.prepend(checkbox);
            checkbox.onclick=ListeningCompleted;
            //checkbox.style.appearance='none';
            checkbox.classList.add('forCheckbox')
            div.appendChild(label);
            const parent=document.querySelector(".taskcreate");
            parent.appendChild(div);
}
deleteCompleted();
})
}



