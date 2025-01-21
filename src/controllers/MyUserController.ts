import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUser = await User.findOne({ _id: req.userId });
        if (!currentUser) {
        res.status(404).json({ message: "User not found" });
        return; // Ensure no further code executes
    }

    res.json(currentUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const createCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            res.status(200).json(existingUser.toObject());
            return;
        }

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};
const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;

        await user.save();
        res.status(200).json(user); // Explicitly set status and return user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
};
export default {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser,
};

