import { CampusPrintJob, CreatePrintJobDto } from '@studentlife/shared';

export class CampusPrintingService {
  private static jobs: CampusPrintJob[] = [
    {
      id: 'print-01',
      documentTitle: 'GATE_Calculus_Formula_Sheet_A4.pdf',
      pageCount: 6,
      isDoubleSided: true,
      isColor: false,
      estimatedCostINR: 12,
      location: 'CENTRAL_LIBRARY',
      qrReleaseCode: 'QR-LIB-4912',
      status: 'READY_FOR_PICKUP',
      createdAt: new Date().toISOString()
    },
    {
      id: 'print-02',
      documentTitle: 'LoRA_Distributed_Paper_Draft_v2.pdf',
      pageCount: 14,
      isDoubleSided: true,
      isColor: true,
      estimatedCostINR: 70,
      location: 'CS_DEPT_LAB',
      qrReleaseCode: 'QR-CS-8819',
      status: 'QUEUED',
      createdAt: new Date().toISOString()
    }
  ];

  public static getJobs(): CampusPrintJob[] {
    return this.jobs;
  }

  public static createJob(dto: CreatePrintJobDto): CampusPrintJob {
    const isDoubleSided = dto.isDoubleSided !== undefined ? dto.isDoubleSided : true;
    const isColor = dto.isColor !== undefined ? dto.isColor : false;
    const pages = dto.pageCount || 4;

    const basePageRate = isColor ? 5.0 : 2.0;
    const effectiveSheets = isDoubleSided ? Math.ceil(pages / 2) : pages;
    const cost = isDoubleSided ? effectiveSheets * (basePageRate * 1.8) : effectiveSheets * basePageRate;

    const newJob: CampusPrintJob = {
      id: `print-${Date.now()}`,
      documentTitle: dto.documentTitle || 'Student_Assignment_Printout.pdf',
      pageCount: pages,
      isDoubleSided,
      isColor,
      estimatedCostINR: Math.round(cost),
      location: dto.location || 'CENTRAL_LIBRARY',
      qrReleaseCode: `QR-KIOSK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'QUEUED',
      createdAt: new Date().toISOString()
    };

    this.jobs.unshift(newJob);
    return newJob;
  }
}
