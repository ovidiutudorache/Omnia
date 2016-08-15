using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class AuthenticationRequest
    {
        public Guid ApplicationId { get; set; }
        public OAuthProviders Provider { get; set; }
        public string State { get; set; }
    }
}