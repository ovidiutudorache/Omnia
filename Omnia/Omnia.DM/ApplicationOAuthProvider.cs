using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class ApplicationOAuthProvider
    {
        public int Id { get; set; }
        public string ExternalId { get; set; }
        public string ExternalSecret { get; set; }
        public string Scope { get; set; }
    }
}
