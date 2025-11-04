const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector('#ask');

input?.addEventListener('keyup', handleEnter);
askBtn.addEventListener('click', handleAsk);

async function generate(text) {
   /**
    * 1.append message to UI
    * 2.Send it to LLM
    * 3.Append message to UI
    */
   const msg = document.createElement('div');
   msg.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";
   msg.textContent = text;
   chatContainer?.appendChild(msg);
   input.value = '';

   //Call Server
   const assistantMesssage=await callServer(text);
   console.log("assistant msg",assistantMesssage);

   const assistantMesssageElem = document.createElement('div');
   assistantMesssageElem.className = "max-w-fit";
   assistantMesssageElem.textContent = assistantMesssage;
   chatContainer?.appendChild(assistantMesssageElem);
}

async function callServer(inputText) {
   const response = await fetch('http://localhost:3001/chat', {
      method: "POST",
      headers: {
         'content-type': 'application/json'
      },
      body: JSON.stringify({ message: inputText }),
   });

   if (!response.ok) {
      throw new Error("Error generating the response.")
   }
   
   const result=await response.json();
   return result.message;
}

async function handleAsk() {
   const text = input?.value.trim();
   if (!text) {
      return;
   }
   await generate(text);
}

async function handleEnter(e) {
   if (e.key === "Enter") {
      const text = input?.value.trim();
      if (!text) {
         return;
      }
      await generate(text);
   }
}
