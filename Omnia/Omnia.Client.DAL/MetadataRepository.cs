using RS.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Client.DAL
{
    public class MetadataRepository : ClientRepositoryBase
    {
        public MetadataRepository(int applicationId) : base(applicationId) { }

        public List<DM.Collection> GetCollections()
        {
            return DataContext.Collections.OrderBy(el => el.Name).ToList().Select(el => new DM.Collection()
            {
                Id = el.Id,
                SId = el.SId,
                Name = el.Name,
                Schema = GetSchema(el.Name)
            }).ToList();
        }

        private string GetSchema(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return "dbo";

            var parts = name.Split(new char[] { '.' }, StringSplitOptions.RemoveEmptyEntries).ToList();
            if (parts.Count > 0)
                parts.RemoveAt(parts.Count - 1);
            if (parts.Count == 0)
                return "dbo";

            return string.Join(".", parts);
        }
    }
}