import {
  StudentFinancialBudget,
  StudentExpenseItem,
  AddExpenseDto,
  CourseRoiCalcDto,
  CourseRoiResult
} from '@studentlife/shared';

export class StudentFinancesService {
  private static budget: StudentFinancialBudget = {
    monthlyBudget: 12000,
    totalSpentThisMonth: 6850,
    remainingAllowance: 5150,
    savingsRatePercent: 42.9,
    expenses: [
      { id: 'exp-1', category: 'MESS_FOOD', title: 'Campus Canteen & Mess Subsidy', amount: 3200, date: '2026-09-02' },
      { id: 'exp-2', category: 'BOOKS_STATIONERY', title: 'GATE Computer Science PYQ Guidebook', amount: 850, date: '2026-09-03' },
      { id: 'exp-3', category: 'COURSES_TESTS', title: 'Full-Length National Mock Test Series', amount: 1499, date: '2026-09-04' },
      { id: 'exp-4', category: 'TRANSPORT', title: 'Monthly Metro & Student Travel Card', amount: 900, date: '2026-09-05' },
      { id: 'exp-5', category: 'LEISURE', title: 'Weekend Coffee with Study Group', amount: 401, date: '2026-09-06' }
    ],
    suggestedGigs: [
      { id: 'gig-1', title: 'Python / DSA Code Reviewer for Juniors', payoutAmount: 2500, requiredSkills: ['Python', 'DSA'], estimatedHours: '4 hrs/week', platform: 'Campus Peer Hub' },
      { id: 'gig-2', title: 'Linear Algebra & Calculus Tutor', payoutAmount: 4000, requiredSkills: ['Engineering Math', 'Calculus'], estimatedHours: '6 hrs/week', platform: 'StudentLife Tutor Exchange' },
      { id: 'gig-3', title: 'Technical Blog Writer (Operating Systems)', payoutAmount: 1800, requiredSkills: ['Technical Writing', 'OS'], estimatedHours: '3 hrs/article', platform: 'Dev Community' }
    ]
  };

  public static getBudget(): StudentFinancialBudget {
    return this.budget;
  }

  public static addExpense(dto: AddExpenseDto): StudentFinancialBudget {
    const newExpense: StudentExpenseItem = {
      id: `exp-${Date.now()}`,
      category: dto.category,
      title: dto.title,
      amount: Number(dto.amount),
      date: new Date().toISOString().split('T')[0]
    };

    this.budget.expenses.unshift(newExpense);
    this.budget.totalSpentThisMonth += newExpense.amount;
    this.budget.remainingAllowance = Math.max(0, this.budget.monthlyBudget - this.budget.totalSpentThisMonth);
    this.budget.savingsRatePercent = Math.max(0, Math.round(((this.budget.monthlyBudget - this.budget.totalSpentThisMonth) / this.budget.monthlyBudget) * 100));

    return this.budget;
  }

  public static calculateCourseRoi(dto: CourseRoiCalcDto): CourseRoiResult {
    const cost = Math.max(1, Number(dto.totalCourseCost));
    const annualSalary = Math.max(1, Number(dto.expectedStartingSalaryAnnual));
    const monthlyTakehome = annualSalary / 12;

    const paybackPeriodMonths = Math.round((cost / (monthlyTakehome * 0.4)) * 10) / 10;
    const total3YearEarnings = annualSalary * 3;
    const threeYearRoiPercentage = Math.round(((total3YearEarnings - cost) / cost) * 100);

    let verdict: 'HIGH_ROI' | 'MODERATE_ROI' | 'LOW_ROI' = 'HIGH_ROI';
    if (paybackPeriodMonths > 12) verdict = 'LOW_ROI';
    else if (paybackPeriodMonths > 6) verdict = 'MODERATE_ROI';

    return {
      paybackPeriodMonths,
      threeYearRoiPercentage,
      verdict,
      recommendations: [
        `Estimated payback period is only ${paybackPeriodMonths} months under conservative 40% income allocation.`,
        `Expected 3-year net ROI yield exceeds ${threeYearRoiPercentage}%.`,
        'Leverage StudentLife OS free interview prep & ATS resume builder to accelerate tier-1 job offers.'
      ]
    };
  }
}
