const input=document.querySelector("#input");
const chatContainer=document.querySelector("#chat-container");
const askBtn=document.querySelector('#ask');

input?.addEventListener('keyup',handleEnter);
askBtn.addEventListener('click',handleAsk);

function generate(text){
  /**
   * 1.append message to UI
   * 2.Send it to LLM
   * 3.Append message to UI
   */
  const msg=document.createElement('div');
  msg.className="my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";
  msg.textContent=text;
  chatContainer?.appendChild(msg);
  input.value='';
}

function handleAsk(){
     const text=input?.value.trim();
     if(!text){
        return;
     }
     generate(text);
}

function handleEnter(e){
   if(e.key==="Enter"){
     const text=input?.value.trim();
     if(!text){
        return;
     }
     generate(text);
   }
}
