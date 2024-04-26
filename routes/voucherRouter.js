import express from "express";
import { addVoucher, getVoucherByEmail, useVoucher } from "../controllers/voucherController.js";

const voucherRouter = express.Router();

voucherRouter.get("/getVoucherByEmail", getVoucherByEmail);
voucherRouter.post("/addVoucher", addVoucher);
voucherRouter.put("/useVoucher", useVoucher);

export default voucherRouter;
