import mongoose from "mongoose";



const Document = new mongoose.Schema({
  userId: { type: String,  required: true },
  docName:{type: String, required: true},
    docData: { type: String, required: true },
    sharedWith: [],
    owner:{type: String, required: true},
  });



 export const DocumentModel =  mongoose.model('Document', Document);