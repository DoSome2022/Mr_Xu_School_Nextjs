import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';
import { Booklist_Create_Schema } from "@/actions/Create-Booklist/schema";


export default async (req , res) =>{
    if(req.method === 'POST') {
        try {
            const data = await Booklist_Create_Schema.parse(req.body);
        } catch (error) {
            
        }
    }
}