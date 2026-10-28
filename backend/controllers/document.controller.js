import Document from "../models/document.model.js";

export const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (
      !title ||
      !content ||
      title.trim().length === 0 ||
      content.trim().length === 0
    ) {
      return res.status(400).json({
        message:
          "Please add the valid data (fields cannot be empty or just spaces)",
      });
    }
    const document = await Document.create({ title, content, user: req.user });

    return res.status(201).json({ success: true, document });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create document" });
  }
};

export const getDocument = async (req, res) => {
  try {
    console.log(req.user)
    const documents = await Document.find({user: req.user}).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch documents" });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({ message: "Document Not Found" });
    }
    const document = await Document.findById(id);
    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({ message: "Document Not Found" });
    }
    const updatedDocument = await Document.findByIdAndUpdate(id, req.body);
    return res.status(200).json({ message: "Document Updated Succesfully!", updatedDocument });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const {id} = req.params;
    if(!id) {
      return res.status(404).json({message: "Document Not Found"});
    }
    const document = await Document.findByIdAndDelete(id);
    return res.status(200).json({message: "Document Deleted Succesfully!", document});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}
