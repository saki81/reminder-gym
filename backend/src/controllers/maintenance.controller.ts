import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getGymAccess } from "../utils/gymAccess.js";

export const createMaintenance = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMaintenances = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMaintenance = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteMaintenance = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};