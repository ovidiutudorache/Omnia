using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Configuration
{
    public class Local
    {
        public class App
        {
            public static readonly Uri BaseUrl = new Uri(ConfigurationManager.AppSettings["APP:BaseUrl"]);
        }
    }
}
