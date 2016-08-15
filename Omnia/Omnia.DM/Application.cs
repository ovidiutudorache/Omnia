using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class Application
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; }
        public string Name { get; set; }
        public string PrivateKey { get; set; }
        public Dictionary<OAuthProviders, ApplicationOAuthProvider> OAuthProviders { get; set; }
        public string RedirectUrl { get; set; }
    }
}
