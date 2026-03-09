let queue=[]
let blocks=[100,500,200,300,600]

function renderMemory(){

let container=document.getElementById("memory")
container.innerHTML=""

blocks.forEach((b,i)=>{

let div=document.createElement("div")
div.className="block"

if(typeof b==="number"){
div.classList.add("free")
div.innerHTML="Free<br>"+b
}else{
div.classList.add("allocated")
div.innerHTML=b.name+"<br>"+b.size
}

div.id="block"+i
container.appendChild(div)

})

}

renderMemory()

function renderQueue(){

let q=document.getElementById("queue")
q.innerHTML=""

queue.forEach(p=>{
let div=document.createElement("div")
div.className="process"
div.innerText=p.name+"("+p.size+")"
q.appendChild(div)
})

}

function addProcess(){

let name=document.getElementById("pname").value
let size=parseInt(document.getElementById("psize").value)

if(!name || !size) return

queue.push({name,size})
renderQueue()

}

function updateCaption(){

let strategy=document.getElementById("strategy").value
let caption=document.getElementById("strategyCaption")

if(strategy==="first")
caption.innerText="First Fit: Allocate the first memory block large enough for the process."

if(strategy==="best")
caption.innerText="Best Fit: Allocate the smallest memory block that fits the process."

if(strategy==="worst")
caption.innerText="Worst Fit: Allocate the largest available memory block."

}

async function startAllocation(){

if(queue.length===0) return

let process=queue.shift()
renderQueue()

let strategy=document.getElementById("strategy").value

document.getElementById("status").innerText=
"Scanning memory for process "+process.name+" ("+process.size+")"

let pointer=document.getElementById("pointer")

let chosenIndex=-1
let best=Infinity
let worst=-1

for(let i=0;i<blocks.length;i++){

movePointer(i)
await sleep(700)

if(typeof blocks[i]==="number" && blocks[i]>=process.size){

if(strategy==="first"){
chosenIndex=i
break
}

if(strategy==="best"){
if(blocks[i]<best){
best=blocks[i]
chosenIndex=i
}
}

if(strategy==="worst"){
if(blocks[i]>worst){
worst=blocks[i]
chosenIndex=i
}
}

}

}

if(strategy==="best" || strategy==="worst"){
movePointer(chosenIndex)
await sleep(600)
}

if(chosenIndex!==-1){

blocks[chosenIndex]={name:process.name,size:process.size}

document.getElementById("status").innerText=
process.name+" allocated to block "+chosenIndex

}else{

document.getElementById("status").innerText=
"No suitable block found"

}

renderMemory()

}

function movePointer(index){

let block=document.getElementById("block"+index)
let pointer=document.getElementById("pointer")

pointer.style.left=block.offsetLeft+40+"px"

}

function sleep(ms){
return new Promise(r=>setTimeout(r,ms))
}

function resetAll(){

blocks=[100,500,200,300,600]
queue=[]
renderMemory()
renderQueue()
document.getElementById("status").innerText=""
}