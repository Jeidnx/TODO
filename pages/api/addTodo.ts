import {NextApiRequest, NextApiResponse} from "next";
import {addTodo} from "../../lib/redis";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') return;
    await addTodo({description: req.body.description, priority: Number(req.body.priority)});
    res.status(200).send(null);

};