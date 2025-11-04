import express from 'express';
import cors from 'cors';//express middleware
import { generate } from './chatbot.js';

const app = express()
const port = 3001;
app.use(cors());
app.use(express.json());//middleware

app.get('/', (req, res) => {
  res.send('Welcome to CHATDPT!')
})

app.post('/chat',async(req,res)=>{
   const {message}=req.body;

   console.log('Message',message);
   const result=await generate(message);
   res.json({message:result});
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
