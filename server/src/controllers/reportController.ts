import { Request, Response } from 'express';
import { createReport } from '../services/reportService';

export async function submitReport(req: Request, res: Response) {
  try {
    const data = req.body;
    const result = await createReport(data);

    const io = req.app.get('io');
    if (io) {
      io.emit('report_created', result.report);
      if (result.verifiedReports) {
        io.emit('report_verified', result.verifiedReports);
      }
    }

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}