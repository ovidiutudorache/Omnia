using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Client.DM
{
    public class ConsumerException: Exception
    {
        public string ExceptionMessage { get; set; }
    }
}
