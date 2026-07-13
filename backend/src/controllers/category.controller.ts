import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getGymAccess } from "../utils/gymAccess.js";

export const createCategory = async ( req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};