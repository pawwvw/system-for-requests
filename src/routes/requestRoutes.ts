import { Router, Request, Response } from "express";
import { RequestEntity } from "../entity/Request";
import { Status } from "../entity/Request";
import { AppDataSource } from "../data-source";
import { Between } from "typeorm";

const requestRepository = AppDataSource.getRepository(RequestEntity);
const router = Router();

// create new
router.post('/requests', async (req: Request, res: Response): Promise<any> => {
    try{
        const { subject, description } = req.body;

        if (!subject && !description){
            return res.status(400).send('the subject and description are required for the request');
        };

        const request = requestRepository.create({
            subject,
            description,
            status: Status.NEW
        });

        await requestRepository.save(request);

        return res.status(201).send(request);
    } catch (error) {
        return res.status(500).send(error);
    };
    
});

// take the request to work
router.patch('/requests/:id/in-progress', async (req: Request, res: Response): Promise<any> => {
    try{
        const { id } = req.params;
        const request = await requestRepository.findOne({where: {id: +id}});
        if (!request){
            return res.status(404).send(`the request id: ${id} was not found`);
        };

        request.status = Status.IN_PROGRESS;

        await requestRepository.save(request);

        return res.status(200).send(`the request id: ${id} was took to work`);
    } catch (error){
        return res.status(500).send(error);
    };
});

// complete the request
router.patch('/requests/:id/complete', async (req: Request, res: Response): Promise<any> => {
    try{
        const { id } = req.params;
        const { solution } = req.body;
        const request = await requestRepository.findOne({where: {id: +id}});
        if (!request){
            return res.status(404).send(`the request id: ${id} was not found`);
        };

        if (!solution){
            return res.status(400).send('to comlete the request, you need the solution');
        };

        if (request.status !== Status.IN_PROGRESS){
            return res.status(400).send('to comlete the request, it status must be "in_progress"');
        };;

        request.status = Status.COMPLETED;
        request.solution = solution;

        await requestRepository.save(request);

        return res.status(200).send(`the request id: ${id} was completed`);
    } catch (error){
        return res.status(500).send(error);
    };
});

// cancel the request
router.patch('/requests/:id/cancel', async (req: Request, res: Response): Promise<any> => {
    try{
        const { id } = req.params;
        const { cancellation_reason } = req.body;
        const request = await requestRepository.findOne({where: {id: +id}});
        if (!request){
            return res.status(404).send(`the request id: ${id} was not found`);
        };

        if (!cancellation_reason){
            return res.status(400).send('to cancel the request, you need the cancellation_reason');
        };

        if (request.status !== Status.IN_PROGRESS){
            return res.status(400).send('to cancel the request, it status must be "in_progress"');
        };

        request.status = Status.CANCELED;
        request.cancellation_reason = cancellation_reason;

        await requestRepository.save(request);

        return res.status(200).send(`the request id: ${id} was canceled`);
    } catch (error){
        return res.status(500).send(error);
    };
    
});

// get a requests by date or get all requests
router.get('/requests', async (req: Request, res: Response): Promise<any> => {
    try{
        const { date, startDate, endDate } = req.query;

        console.log(new Date (date as string))

        let filters:any = {};

        if (date) {
            const startOfDay = new Date(date as string);
            const endOfDay = new Date(date as string);
            endOfDay.setHours(23, 59, 59, 999);

            filters.created_at = Between(startOfDay, endOfDay);
        }

        if (startDate && endDate){
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            end.setHours(23, 59, 59, 999);
            
            filters.created_at = Between(start, end);
        }

        const requests = await requestRepository.find({where: filters});

        return res.status(200).send(requests);
    } catch (error){
        return res.status(500).send(error);
    };
});

export default router;