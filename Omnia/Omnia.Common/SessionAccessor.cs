using RS.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Common
{
    public abstract class SessionAccessor: BaseSessionAccessor
    {
        private class Keys
        {
            internal const string Prefix = "Omnia_";
            internal static readonly string Error = Prefix + "Error";
        }

        public static string Error
        {
            get { return Get<string>(Keys.Error); }
            set { Set(Keys.Error, value); }
        }
    }
}