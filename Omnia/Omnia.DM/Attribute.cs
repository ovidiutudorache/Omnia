using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class Attribute
    {
        public int Id { get; set; }
        public Collection Collection { get; set; }
        public int CollectionId { get; set; }
        public string Name { get; set; }
        public bool IsNullable { get; set; }
        public SqlDbType Type { get; set; }
        public int? Scale { get; set; }
        public int? Precision { get; set; }
        public int? Length { get; set; }
        public bool IsPrimaryKey { get; set; }
        public string DefaultValue { get; set; }
        public string Formula { get; set; }
        public bool IsPersistent { get; set; }
        public bool IsSparse { get; set; }
        public string Description { get; set; }
    }
}
