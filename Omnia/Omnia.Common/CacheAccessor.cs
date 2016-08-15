using RS.Caching;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Common
{
    public abstract class CacheAccessor
    {
        private class Keys
        {
            internal const string Prefix = "Omnia_";
            internal static readonly string Applications = Prefix + "Applications";
        }

        public static Dictionary<Guid, DM.Application> Applications
        {
            get { return Cache.Default.Get(Keys.Applications) as Dictionary<Guid, DM.Application>; }
            set { Cache.Default.Set(Keys.Applications, value); }
        }

        public static void Clear()
        {
            Cache.Default.RemoveAll();
        }
    }
}