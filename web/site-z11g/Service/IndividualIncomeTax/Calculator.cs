using System;
using System.Collections.Generic;
using System.Linq;

namespace SiteZ11G.Service.IndividualIncomeTax
{
    public class Calculator
    {
        public static Calculator Create(TaxType taxType = TaxType.After2018)
        {
            var calculator = new Calculator();

            if (taxType == TaxType.After2018)
            {
                //《2018年个人所得税法修正案草案》
                //十六、 将个人所得税税率表一(工资、薪金所得适用)修改为：
                //个人所得税税率表一(综合所得适用)
                //级数 全年应纳税所得额 税率(%)
                //1 不超过36000元的 3
                //2 超过36000元至144000元的部分 10
                //3 超过144000元至300000元的部分 20
                //4 超过300000元至420000元的部分 25
                //5 超过420000元至660000元的部分 30
                //6 超过660000元至960000元的部分 35
                //7 超过960000元的部分 45
                calculator.SetBasePointByYear(60000);
                calculator.AddLevelByYear(36000, 3);
                calculator.AddLevelByYear(144000, 10);
                calculator.AddLevelByYear(300000, 20);
                calculator.AddLevelByYear(420000, 25);
                calculator.AddLevelByYear(660000, 30);
                calculator.AddLevelByYear(960000, 35);
                calculator.AddLevelByYear(decimal.MaxValue, 45);
            }
            else if (taxType == TaxType.Before2018)
            {
                calculator.SetBasePoint(3500);
                calculator.AddLevel(1500, 3);
                calculator.AddLevel(4500, 10);
                calculator.AddLevel(9000, 20);
                calculator.AddLevel(35000, 25);
                calculator.AddLevel(55000, 30);
                calculator.AddLevel(80000, 35);
                calculator.AddLevel(decimal.MaxValue, 45);
            }

            return calculator;
        }

        private void SetBasePoint(decimal money)
        {
            m_basePoint = money;
        }

        private void SetBasePointByYear(decimal money)
        {
            SetBasePoint(money / 12);
        }

        private void AddLevel(decimal moneyUpper, decimal taxRate)
        {
            m_taxLevels.Add(new TaxLevel { MoneyUpper = moneyUpper, TaxRate = taxRate / 100 });
            m_taxLevels.OrderBy(x => x.MoneyUpper).ToList();
        }

        private void AddLevelByYear(decimal moneyUpperPerYear, decimal taxRate)
        {
            AddLevel(moneyUpperPerYear / 12, taxRate);
        }

        public TaxResult Calculate(decimal income, decimal insuranceAndHousingProvidentFund)
        {
            var taxResult = new TaxResult() {
                Income = income,
                InsuranceAndHousingProvidentFund = insuranceAndHousingProvidentFund
            };

            income -= insuranceAndHousingProvidentFund;
            income -= m_basePoint;

            var prevIncomeLevel = 0m;
            foreach (var taxLevel in m_taxLevels)
            {
                if (income > prevIncomeLevel)
                {
                    decimal incomeToCalcTax = Math.Min(income - prevIncomeLevel, taxLevel.MoneyUpper - prevIncomeLevel);
                    decimal tax = incomeToCalcTax * taxLevel.TaxRate;

                    taxResult.TaxLevelResults.Add(new TaxLevelResult { TaxLevel = taxLevel, Tax = tax });
                }
                else
                {
                    taxResult.TaxLevelResults.Add(new TaxLevelResult { TaxLevel = taxLevel, Tax = 0m });
                }

                prevIncomeLevel = taxLevel.MoneyUpper;
            }

            return taxResult;
        }

        private decimal m_basePoint;

        private List<TaxLevel> m_taxLevels = new List<TaxLevel>();

        private Calculator() { }
    }
}