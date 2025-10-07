import mongoose from "mongoose";

const vaultItemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  encryptedData: {
    iv: { type: String, required: true },
    ciphertext: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.VaultItem || mongoose.model("VaultItem", vaultItemSchema);
