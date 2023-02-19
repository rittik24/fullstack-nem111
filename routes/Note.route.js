const express=require("express");
const notesRouter=express.Router();
require("dotenv").config();
const {NoteModel}=require("../models/Note.model");

notesRouter.get("/",async (req,res)=>{
    const data=await NoteModel.find();
    res.send(data);
})

notesRouter.post("/add",async (req,res)=>{
    const payload=req.body;
    try{
        const user=new NoteModel(payload);
                await user.save();
                res.send("Registered");
    }catch(err){
        res.send("Something Went Wrong");
    }
})

notesRouter.patch("/update/:id",async (req,res)=>{
    const payload=req.body;
    const id=req.params.id;
    const note=await NoteModel.findOne({"_id":id});
    const userID_in_note=note.userID;
    const userID_making_req=req.body.userID;
    try{
       
        if(userID_in_note!=userID_making_req){
            res.send("You are not authorized");
        }else{
            await NoteModel.findByIdAndUpdate({_id:id},payload)
            res.send(`data has been updated with id: ${id}`);  
        }
    }catch(err){
        res.send("Something Went Wrong"+err);
        
    }
})

notesRouter.delete("/delete/:id",async (req,res)=>{
    const id=req.params.id;
    const note=await NoteModel.findOne({"_id":id});
    const userID_in_note=note.userID;
    const userID_making_req=req.body.userID;
    try{
        if(userID_in_note!=userID_making_req){
            res.send("You are not authorized");
        }else{
        await NoteModel.findByIdAndDelete({_id:id})
        res.send(`data has been deleted with id: ${id}`);
        }
    }catch(err){
        res.send("Something Went Wrong"+err);
        
    }
})

module.exports={notesRouter};