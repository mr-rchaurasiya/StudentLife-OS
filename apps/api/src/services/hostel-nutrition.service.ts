import { HostelDailyMenu, NutrientIntakeLog, LogNutrientIntakeDto, RateMealDto } from '@studentlife/shared';

export class HostelNutritionService {
  private static weeklyMenu: HostelDailyMenu[] = [
    {
      dayOfWeek: 'MONDAY',
      messHallName: 'Aryabhatta Central Dining Hall',
      meals: [
        { id: 'm-01', slot: 'BREAKFAST', dishName: 'Sprouted Moong Salad & Poha with Roasted Peanuts', isVegetarian: true, caloriesKcal: 420, proteinGrams: 16, brainFuelTag: 'Slow GI & High Choline', avgStudentRating: 4.5 },
        { id: 'm-02', slot: 'LUNCH', dishName: 'Paneer Makhani, Tadka Dal, Jeera Rice & Multigrain Roti', isVegetarian: true, caloriesKcal: 680, proteinGrams: 28, brainFuelTag: 'Complete Amino Acids', avgStudentRating: 4.7 },
        { id: 'm-03', slot: 'EVENING_SNACKS', dishName: 'Roasted Makhana & Masala Tea', isVegetarian: true, caloriesKcal: 180, proteinGrams: 6, brainFuelTag: 'Magnesium & Focus Booster', avgStudentRating: 4.2 },
        { id: 'm-04', slot: 'DINNER', dishName: 'Palak Paneer, Yellow Moong Dal, Steamed Rice & Curd', isVegetarian: true, caloriesKcal: 610, proteinGrams: 24, brainFuelTag: 'Iron & Tryptophan for Sleep', avgStudentRating: 4.6 }
      ]
    },
    {
      dayOfWeek: 'TUESDAY',
      messHallName: 'Aryabhatta Central Dining Hall',
      meals: [
        { id: 'm-05', slot: 'BREAKFAST', dishName: 'South Indian Idli Sambar with Coconut Chutney', isVegetarian: true, caloriesKcal: 390, proteinGrams: 12, brainFuelTag: 'Fermented Probiotics', avgStudentRating: 4.6 },
        { id: 'm-06', slot: 'LUNCH', dishName: 'Rajma Chawal, Mixed Vegetable Curry & Cucumber Raita', isVegetarian: true, caloriesKcal: 650, proteinGrams: 22, brainFuelTag: 'High Soluble Fiber', avgStudentRating: 4.8 },
        { id: 'm-07', slot: 'EVENING_SNACKS', dishName: 'Boiled Chana Chaat & Green Tea', isVegetarian: true, caloriesKcal: 210, proteinGrams: 9, brainFuelTag: 'Antioxidants & Catechins', avgStudentRating: 4.3 },
        { id: 'm-08', slot: 'DINNER', dishName: 'Aloo Gobi Matar, Dal Fry, Phulka & Warm Kheer', isVegetarian: true, caloriesKcal: 590, proteinGrams: 18, brainFuelTag: 'Clean Carb Recovery', avgStudentRating: 4.4 }
      ]
    }
  ];

  private static dailyLog: NutrientIntakeLog = {
    totalCalories: 1890,
    proteinGramsToday: 72,
    targetProteinGrams: 90,
    caffeineMgToday: 140,
    hydrationLitersToday: 2.8,
    brainNutrientStatus: {
      omega3Status: 'OPTIMAL',
      vitaminB12Status: 'OPTIMAL',
      ironStatus: 'OPTIMAL'
    },
    sleepLatencyImpactWarning: 'Caffeine cutoff: Avoid high caffeine after 6:00 PM to protect deep REM memory consolidation phase.'
  };

  public static getMenu(): HostelDailyMenu[] {
    return this.weeklyMenu;
  }

  public static getLog(): NutrientIntakeLog {
    return this.dailyLog;
  }

  public static logIntake(dto: LogNutrientIntakeDto): NutrientIntakeLog {
    this.dailyLog.totalCalories += dto.caloriesKcal || 0;
    this.dailyLog.proteinGramsToday += dto.proteinGrams || 0;
    if (dto.caffeineMg) {
      this.dailyLog.caffeineMgToday += dto.caffeineMg;
    }
    if (dto.waterMl) {
      this.dailyLog.hydrationLitersToday = parseFloat((this.dailyLog.hydrationLitersToday + dto.waterMl / 1000).toFixed(2));
    }
    return this.dailyLog;
  }

  public static rateMeal(dto: RateMealDto): { success: boolean; message: string } {
    for (const menu of this.weeklyMenu) {
      const meal = menu.meals.find(m => m.id === dto.dishId);
      if (meal) {
        meal.avgStudentRating = parseFloat(((meal.avgStudentRating * 10 + dto.rating) / 11).toFixed(1));
        return { success: true, message: `Recorded rating of ${dto.rating}★ for ${meal.dishName}` };
      }
    }
    return { success: true, message: `Recorded rating of ${dto.rating}★` };
  }
}
