import { DocumentModel } from "../model/document.js";

export const addDoc = async (req, res) => {
  const bodyData = req.body;

  try {
    const newDoc = new DocumentModel({
      userId: bodyData.userId,
      docName: bodyData.docName || "",
      docData: bodyData.docData || "",
      owner: bodyData.owner,
    });

    // Save the document to the database using Promises
    const savedDoc = await newDoc.save();
    console.log("Document saved:", savedDoc);
    res.status(201).json(savedDoc);
  } catch (err) {
    console.error("Error saving document:", err);
    res.status(500).send("Internal Server Error");
  }
};
export const getDocs = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch all documents from the database
    const docs = await DocumentModel.find({ userId: userId });
    res.status(200).json(docs);
  } catch (err) {
    console.error("Error getting documents:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const getDocumentById = async (req, res) => {
  const { documentId } = req.params; // Assuming the documentId is part of the route parameters

  try {
    // Find the document by its ID
    const document = await DocumentModel.findById(documentId);

    // Check if the document exists
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    // Send the document data as JSON in the response
    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error("Error getting document by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateSharedDocument = async (req, res) => {
  const bodyData = req.body;

  try {
    // Check if the required fields are present in the request body
    if (!bodyData.documentId || !bodyData.userEmailToShareWith) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    // Find the document by its ID
    const documentToShare = await DocumentModel.findById(bodyData.documentId);

    // Check if the document exists
    if (!documentToShare) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    // Check if the email is not already in the sharedWith array
   

    if (bodyData.push) {
      const isEmailAlreadyShared = documentToShare.sharedWith.includes(
        bodyData.userEmailToShareWith
      );
      if (isEmailAlreadyShared) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Document is already shared with this email",
          });
      }
      await DocumentModel.updateOne(
        { _id: bodyData.documentId },
        { $push: { sharedWith: bodyData.userEmailToShareWith } }
      );
    } else {
      await DocumentModel.updateOne(
        { _id: bodyData.documentId },
        { $pull: { sharedWith: bodyData.userEmailToShareWith } }
      );
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error updating shared document:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateDocData = async (req, res) => {
  const { documentId } = req.params; // Assuming the documentId is part of the route parameters
  const { newDocData } = req.body;

  try {
    // Check if the required fields are present in the request body
    if (!newDocData) {
      return res
        .status(400)
        .json({ success: false, message: "New document data is missing" });
    }

    // Find the document by its ID
    const documentToUpdate = await DocumentModel.findById(documentId);

    // Check if the document exists
    if (!documentToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    // Update the document with the new docData
    documentToUpdate.docData = newDocData;

    // Save the updated document
    await documentToUpdate.save();

    return res
      .status(200)
      .json({ success: true, message: "Document data updated successfully" });
  } catch (error) {
    console.error("Error updating document data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteDocument = async (req, res) => {
  const { documentId } = req.params; // Assuming the documentId is part of the route parameters

  try {
    // Find the document by its ID
    const documentToDelete = await DocumentModel.findById(documentId);

    // Check if the document exists
    if (!documentToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    // Delete the document
    const deletedDoc = await documentToDelete.deleteOne();

    return res
      .status(200)
      .json({
        success: true,
        message: "Document deleted successfully",
        deletedDoc,
      });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
