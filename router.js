import express from "express"
import * as docController from "./controllers/documents.js";
import * as userController from "./controllers/userController.js";
export const router = express.Router();

router.get("/getDocs/:userId", docController.getDocs);
router.get("/getDoc/:documentId", docController.getDocumentById);
router.post("/addDoc", docController.addDoc);
router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/share-doc", docController.updateSharedDocument);
router.put("/update-doc-data/:documentId", docController.updateDocData);
router.delete('/delete-doc/:documentId', docController.deleteDocument);
