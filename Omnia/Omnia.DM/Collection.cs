using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class Collection
    {
        public int Id { get; set; }
        public Guid SId { get; set; }
        public string Name { get; set; }
        public string Schema { get; set; }
    }
}