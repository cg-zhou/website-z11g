using System.Collections.Generic;
using System.Linq;

namespace SiteZ11G.Service.IndividualIncomeTax
{
    public class TaxResult
    {
        public List<TaxLevelResult> TaxLevelResults { get; set; } = new List<TaxLevelResult>();

        public decimal SumTax { get { return TaxLevelResults.Sum(x => x.Tax); } }

        public decimal Income { get; set; }

        public decimal InsuranceAndHousingProvidentFund { get; set; }

        public decimal NetIncomePerMonth { get { return Income - InsuranceAndHousingProvidentFund - SumTax; } }
    }
}